import pytest
import uuid
from datetime import datetime, timezone, timedelta
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.graph_engine import KnowledgeGraphService
from backend.app.services.learner_state import LearnerStateService
from backend.app.services.adaptive_engine import AdaptiveEngineService, RecommendationPolicy
from backend.app.services.goal_engine import GoalEngineService
from backend.app.simulation.learner_personas import SyntheticLearner, SimulationRunner
from backend.app.seeds.seed_data import seed_all

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    seed_all()
    session = SessionLocal()
    yield session
    session.close()

def test_scenario_a_novice_learning_progression(db):
    """
    Scenario A (Novice):
    Tests that a novice starting with zero prior knowledge is gently guided
    through foundations (LEARN/EXPLAIN) without premature escalation.
    """
    uid = uuid.uuid4().hex[:6]
    user = m.User(email=f"novice_{uid}@example.com", hashed_password="fake", full_name="Novice Alex")
    db.add(user)
    db.commit()

    domain = db.query(m.Domain).filter(m.Domain.slug.like("%clinical-medicine%")).first()
    assert domain is not None

    learner = SyntheticLearner(user, domain, persona_type="NOVICE")
    # Low latent competencies across all concepts
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain.id).all()
    for c in concepts:
        learner.set_latent_competency(c.id, 0.20)

    # First Turn
    turn1 = SimulationRunner.step_learner_session(db, learner)
    assert turn1["recommended_action"] == "LEARN"
    assert "FRONTIER_UNEXPLORED" in turn1["reason_codes"]

    # Verify candidate chosen was a root/foundational concept
    G = KnowledgeGraphService.build_domain_graph(db, domain.id)
    prereqs = KnowledgeGraphService.get_prerequisites(G, turn1["concept_id"])
    assert len(prereqs) == 0, "Novice must be assigned a root concept with 0 unfulfilled prerequisites"

def test_scenario_b_experienced_learner_fast_track(db):
    """
    Scenario B (Experienced / Test-Out):
    Tests that an experienced learner who tests out of foundations is
    immediately advanced to frontier concepts without redundant drills.
    """
    uid = uuid.uuid4().hex[:6]
    user = m.User(email=f"expert_{uid}@example.com", hashed_password="fake", full_name="Dr. Expert Elena")
    db.add(user)
    db.commit()

    domain = db.query(m.Domain).filter(m.Domain.slug.like("%clinical-medicine%")).first()
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain.id).all()
    c_abg = next(c for c in concepts if "ABG" in c.name or "Arterial" in c.name)
    c_ag = next(c for c in concepts if "Anion Gap" in c.name)

    # Fast-track foundations via diagnostic probe
    LearnerStateService.record_diagnostic_mastery(db, user.id, c_abg.id, mastery_level=0.95)
    LearnerStateService.record_diagnostic_mastery(db, user.id, c_ag.id, mastery_level=0.90)

    learner = SyntheticLearner(user, domain, persona_type="EXPERIENCED")
    for c in concepts:
        learner.set_latent_competency(c.id, 0.85)

    rec = AdaptiveEngineService.generate_recommendation(db, user.id, domain.id)
    # The recommendation should NOT recommend c_abg or c_ag for basic LEARN
    assert rec["target"]["id"] not in [c_abg.id, c_ag.id], "Engine must skip mastered foundations"
    assert rec["target"]["id"] in [c.id for c in concepts if c.id not in [c_abg.id, c_ag.id]]

def test_scenario_c_misconception_and_closed_loop_repair(db):
    """
    Scenario C (Misconception & Closed-Loop Remediation):
    Tests that an attempt failure caused by a flawed prerequisite triggers
    automatic taxonomy classification and immediate prerequisite remediation.
    """
    uid = uuid.uuid4().hex[:6]
    user = m.User(email=f"misconception_{uid}@example.com", hashed_password="fake", full_name="Student Carlos")
    db.add(user)
    db.commit()

    domain = db.query(m.Domain).filter(m.Domain.slug.like("%clinical-medicine%")).first()
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain.id).all()
    c_hagma = next(c for c in concepts if "HAGMA" in c.name or "High Anion Gap" in c.name)
    
    # Advanced activity
    act_hagma = db.query(m.Activity).filter(m.Activity.concept_id == c_hagma.id).first()
    if not act_hagma:
        act_hagma = m.Activity(concept_id=c_hagma.id, title="HAGMA Differential Analysis", activity_type="PRACTICE", difficulty=0.75)
        db.add(act_hagma)
        db.commit()

    sess = m.LearningSession(user_id=user.id, domain_id=domain.id, status="ACTIVE")
    db.add(sess)
    db.flush()

    # Simulate attempt with misconception
    attempt = m.Attempt(
        session_id=sess.id,
        user_id=user.id,
        activity_id=act_hagma.id,
        result="FAIL",
        score=0.25,
        error_type="PREREQUISITE_MISCONCEPTION"
    )
    db.add(attempt)
    db.commit()

    failure_event, repair_act = AdaptiveEngineService.diagnose_failure_and_repair(
        db, user.id, session_id=None, activity=act_hagma, attempt=attempt
    )

    assert failure_event.category in [m.FailureCategory.MISCONCEPTION, m.FailureCategory.PREREQUISITE_GAP]
    assert failure_event.severity >= 0.70
    assert repair_act is not None, "Engine must identify an upstream prerequisite repair activity"
    assert repair_act.concept_id != c_hagma.id, "Repair activity must be for an upstream prerequisite concept"

def test_scenario_d_ebbinghaus_forgetting_and_spaced_review(db):
    """
    Scenario D (Forgetting Decay & Spaced Review):
    Tests that when a previously mastered concept decays past its retention threshold,
    the engine prioritizes a REVIEW action over new frontiers.
    """
    uid = uuid.uuid4().hex[:6]
    user = m.User(email=f"forgetting_{uid}@example.com", hashed_password="fake", full_name="Student David")
    db.add(user)
    db.commit()

    domain = db.query(m.Domain).filter(m.Domain.slug.like("%clinical-medicine%")).first()
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain.id).all()
    c_abg = next(c for c in concepts if "ABG" in c.name or "Arterial" in c.name)

    # Learner achieved mastery 30 days ago
    s_abg = LearnerStateService.record_diagnostic_mastery(db, user.id, c_abg.id, mastery_level=0.90)
    now = datetime.now(timezone.utc)
    s_abg.last_seen = now - timedelta(days=30)
    s_abg.review_due = now - timedelta(days=5)  # overdue
    s_abg.forgetting_rate = 0.08
    db.commit()

    # Calculate decayed retention
    retention = LearnerStateService.calculate_retention(s_abg.forgetting_rate, s_abg.last_seen, current_time=now)
    assert retention < 0.25, f"Expected decayed retention, got {retention}"

    # Score candidate with RETENTION_PRIORITY policy
    G = KnowledgeGraphService.build_domain_graph(db, domain.id)
    score, factors = AdaptiveEngineService.score_candidate(
        db, user.id, c_abg, G, policy_version=RecommendationPolicy.RETENTION_PRIORITY
    )
    assert "FORGETTING_RISK" in factors["reason_codes"]
    assert factors["feature_values"]["retention_need"] > 0.75

    # Check action selection
    action = AdaptiveEngineService.select_action(s_abg)
    assert action == "REVIEW", "Overdue concept must trigger REVIEW action"

def test_scenario_e_project_driven_goal_traversal(db):
    """
    Scenario E (Project-Driven Goal Traversal):
    Tests that a learner with an ambitious Capstone Goal receives a topologically
    optimal sequence that satisfies missing prerequisites and advances to the goal.
    """
    uid = uuid.uuid4().hex[:6]
    user = m.User(email=f"project_goal_{uid}@example.com", hashed_password="fake", full_name="Architect Maya")
    db.add(user)
    db.commit()

    domain = db.query(m.Domain).filter(m.Domain.slug.like("%python%")).first()
    assert domain is not None
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain.id).all()
    c_redlock = next(c for c in concepts if "Redlock" in c.name or "Consensus" in c.name)

    # Set ambitious capstone goal targeting distributed Redlock consensus
    goal = m.Goal(
        user_id=user.id,
        domain_id=domain.id,
        title="Implement Distributed Consensus Engine",
        target_concept_ids=[c_redlock.id]
    )
    db.add(goal)
    db.commit()

    gap = GoalEngineService.analyze_goal_gap(db, user.id, goal.id)
    assert gap["goal_id"] == goal.id
    assert gap["total_concepts"] >= 1
    assert gap["completion_percentage"] < 100.0

    # Recommendation should prioritize concepts relevant to this goal
    rec = AdaptiveEngineService.generate_recommendation(db, user.id, domain.id, goal_id=goal.id)
    assert "GOAL_ALIGNED" in rec["reason_codes"]
    assert rec["feature_values"]["goal_relevance"] >= 0.90

def test_policy_audit_logging_and_comparative_trace(db):
    """
    Scenario F (Experimentation & Policy Audit Reproducibility):
    Tests that every recommendation produces a complete, immutable RecommendationAudit record
    with policy version, feature breakdown, weights, and reason codes.
    """
    uid = uuid.uuid4().hex[:6]
    user = m.User(email=f"experiment_{uid}@example.com", hashed_password="fake", full_name="Scientist Vera")
    db.add(user)
    db.commit()

    domain = db.query(m.Domain).filter(m.Domain.slug.like("%macro-finance%")).first()
    assert domain is not None

    # Generate recommendation with Accelerated Challenge Policy
    rec_challenge = AdaptiveEngineService.generate_recommendation(
        db, user.id, domain.id, policy_version=RecommendationPolicy.ACCELERATED_CHALLENGE
    )
    assert rec_challenge["policy_version"] == RecommendationPolicy.ACCELERATED_CHALLENGE

    # Verify audit record in database
    audit = db.query(m.RecommendationAudit).filter(
        m.RecommendationAudit.id == rec_challenge["recommendation_id"]
    ).first()
    assert audit is not None
    assert audit.policy_version == RecommendationPolicy.ACCELERATED_CHALLENGE
    assert audit.selected_action is not None
    assert "prereq_value" in audit.feature_values
    assert "W_GOAL" in audit.weights
    assert len(audit.reason_codes) >= 1
