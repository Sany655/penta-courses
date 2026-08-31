import random
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.services.learner_state import LearnerStateService
from backend.app.services.adaptive_engine import AdaptiveEngineService, RecommendationPolicy
from backend.app.services.graph_engine import KnowledgeGraphService
from backend.app.services.goal_engine import GoalEngineService

class SyntheticLearner:
    def __init__(self, user: m.User, domain: m.Domain, persona_type: str):
        self.user = user
        self.domain = domain
        self.persona_type = persona_type
        self.latent_competencies: Dict[str, float] = {}  # concept_id -> [0.0, 1.0]
        self.action_history: List[Dict[str, Any]] = []

    def set_latent_competency(self, concept_id: str, value: float):
        self.latent_competencies[concept_id] = max(0.0, min(1.0, value))

    def simulate_attempt(self, activity: m.Activity) -> Dict[str, Any]:
        concept_id = activity.concept_id
        latent = self.latent_competencies.get(concept_id, 0.20)
        difficulty = activity.difficulty or 0.5

        # Probability of pass using logistic response model
        diff_delta = (latent - difficulty) * 3.0
        prob_success = 1.0 / (1.0 + 2.71828 ** (-diff_delta))

        # Add slight stochasticity
        is_success = random.random() < prob_success or (latent >= 0.85 and difficulty <= 0.6)
        raw_score = min(1.0, max(0.2, latent + random.uniform(-0.05, 0.1) if is_success else latent * 0.5))

        # Detect error archetype
        error_type = None
        if not is_success:
            if latent < 0.3:
                error_type = "PREREQUISITE_DEFICIT"
            elif 0.3 <= latent < 0.6:
                error_type = "MISCONCEPTION"
            else:
                error_type = "CALCULATION_ERROR"

        return {
            "result": "PASS" if is_success else "FAIL",
            "score": round(raw_score, 2),
            "time_taken_seconds": int(45 + (1.0 - latent) * 60),
            "error_type": error_type
        }

class SimulationRunner:
    @staticmethod
    def step_learner_session(
        db: Session,
        learner: SyntheticLearner,
        session_id: Optional[str] = None,
        goal_id: Optional[str] = None,
        policy_version: str = RecommendationPolicy.DEFAULT_10FACTOR
    ) -> Dict[str, Any]:
        if not session_id:
            sess = db.query(m.LearningSession).filter(
                m.LearningSession.user_id == learner.user.id,
                m.LearningSession.domain_id == learner.domain.id,
                m.LearningSession.status == 'ACTIVE'
            ).first()
            if not sess:
                sess = m.LearningSession(user_id=learner.user.id, domain_id=learner.domain.id, status='ACTIVE')
                db.add(sess)
                db.flush()
            session_id = sess.id

        # 1. Generate Recommendation from Adaptive Engine
        rec = AdaptiveEngineService.generate_recommendation(
            db, learner.user.id, learner.domain.id,
            goal_id=goal_id, session_id=session_id, policy_version=policy_version
        )

        concept_id = rec["target"]["id"]
        action = rec["action"]
        calibrated_diff = rec["activity"]["difficulty"]

        # Fetch or mock activity
        activity = db.query(m.Activity).filter(m.Activity.concept_id == concept_id).first()
        if not activity:
            activity = m.Activity(
                concept_id=concept_id,
                title=f"Synthetic Activity for {rec['target']['name']}",
                activity_type="PRACTICE" if action in ["PRACTICE", "IMPLEMENT"] else "EXPLAIN",
                archetype="causal_graph",
                difficulty=calibrated_diff
            )
            db.add(activity)
            db.flush()

        # 2. Simulate Learner Attempt
        attempt_data = learner.simulate_attempt(activity)

        # 3. Record Attempt & Update Learner State
        attempt = m.Attempt(
            session_id=session_id,
            activity_id=activity.id,
            user_id=learner.user.id,
            result=attempt_data["result"],
            score=attempt_data["score"],
            time_taken_seconds=attempt_data["time_taken_seconds"],
            error_type=attempt_data["error_type"]
        )
        db.add(attempt)
        db.flush()

        # Record Evidence
        evidence_type = m.EvidenceType.PROBLEM_SOLVING if action == "PRACTICE" else (
            m.EvidenceType.EXPLANATION if action == "EXPLAIN" else m.EvidenceType.RECALL
        )
        LearnerStateService.record_evidence(
            db=db,
            user_id=learner.user.id,
            concept_id=concept_id,
            activity_id=activity.id,
            session_id=session_id,
            attempt_id=attempt.id,
            evidence_type=evidence_type,
            score=attempt_data["score"],
            time_taken=attempt_data["time_taken_seconds"]
        )

        # 4. If failed, trigger closed-loop diagnostic repair
        repair_event = None
        if attempt_data["result"] == "FAIL":
            repair_event, repair_act = AdaptiveEngineService.diagnose_failure_and_repair(
                db, learner.user.id, session_id, activity, attempt
            )

        # Record action in history
        turn_summary = {
            "concept_id": concept_id,
            "concept_name": rec["target"]["name"],
            "recommended_action": action,
            "policy_version": policy_version,
            "reason_codes": rec["reason_codes"],
            "attempt_result": attempt_data["result"],
            "attempt_score": attempt_data["score"],
            "repair_triggered": repair_event is not None
        }
        learner.action_history.append(turn_summary)
        return turn_summary
