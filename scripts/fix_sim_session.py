import os

with open('backend/app/simulation/learner_personas.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_step = """    @staticmethod
    def step_learner_session(
        db: Session,
        learner: SyntheticLearner,
        session_id: Optional[str] = None,
        goal_id: Optional[str] = None,
        policy_version: str = RecommendationPolicy.DEFAULT_10FACTOR
    ) -> Dict[str, Any]:
        # 1. Generate Recommendation from Adaptive Engine"""

new_step = """    @staticmethod
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

        # 1. Generate Recommendation from Adaptive Engine"""

code = code.replace(old_step, new_step)
with open('backend/app/simulation/learner_personas.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated session handling in learner_personas.py!')
