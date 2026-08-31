import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal
import backend.app.models as m
from backend.app.services.adaptive_engine import RecommendationPolicy
from backend.app.services.learner_state import LearnerStateService
from backend.app.simulation.learner_personas import SyntheticLearner, SimulationRunner
from backend.app.seeds.seed_data import seed_all

def run_policy_benchmark_simulation(num_learners_per_policy: int = 5, turns_per_learner: int = 10) -> Dict[str, Any]:
    db = SessionLocal()
    seed_all()

    domain = db.query(m.Domain).filter(m.Domain.slug.like("%clinical-medicine%")).first()
    assert domain is not None
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain.id).all()

    policies = [
        RecommendationPolicy.DEFAULT_10FACTOR,
        RecommendationPolicy.ACCELERATED_CHALLENGE,
        RecommendationPolicy.LINEAR_BASELINE
    ]

    benchmark_results = {}

    for policy in policies:
        total_mastery_gained = 0.0
        total_time_spent = 0
        total_repairs = 0
        redundant_drills = 0

        for i in range(num_learners_per_policy):
            uid = uuid.uuid4().hex[:6]
            user = m.User(email=f"bench_{policy}_{uid}@example.com", hashed_password="fake", full_name=f"Bench Student {uid}")
            db.add(user)
            db.commit()

            learner = SyntheticLearner(user, domain, persona_type="MIXED")
            # Initialize random latent mastery
            for c in concepts:
                learner.set_latent_competency(c.id, 0.40)

            session = m.LearningSession(user_id=user.id, domain_id=domain.id, status="ACTIVE")
            db.add(session)
            db.commit()

            for t in range(turns_per_learner):
                turn = SimulationRunner.step_learner_session(
                    db, learner, session_id=session.id, policy_version=policy
                )
                if turn["repair_triggered"]:
                    total_repairs += 1

                # Check if action was redundant drill on concept already > 0.8
                cs = db.query(m.LearnerConceptState).filter(
                    m.LearnerConceptState.user_id == user.id,
                    m.LearnerConceptState.concept_id == turn["concept_id"]
                ).first()
                if cs and cs.mastery and cs.mastery >= 0.80 and turn["recommended_action"] == "LEARN":
                    redundant_drills += 1

            # Compute net domain mastery
            domain_states = db.query(m.LearnerConceptState).filter(
                m.LearnerConceptState.user_id == user.id
            ).all()
            avg_m = (sum(s.mastery or 0.0 for s in domain_states) / max(1, len(domain_states))) if domain_states else 0.0
            total_mastery_gained += avg_m

        avg_mastery_per_learner = total_mastery_gained / num_learners_per_policy
        benchmark_results[policy] = {
            "average_mastery_attained": round(avg_mastery_per_learner, 3),
            "total_repairs_triggered": total_repairs,
            "redundant_drills_count": redundant_drills,
            "efficiency_ratio": round(avg_mastery_per_learner / max(1, turns_per_learner) * 100, 2)
        }

    db.close()
    return benchmark_results

if __name__ == "__main__":
    results = run_policy_benchmark_simulation(num_learners_per_policy=3, turns_per_learner=6)
    print("=== ADAPTIVE POLICY BENCHMARK RESULTS ===")
    for pol, stats in results.items():
        print(f"Policy [{pol}]: {stats}")
