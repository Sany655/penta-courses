import os

with open('backend/app/services/telemetry_service.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_func = """    @staticmethod
    def get_learner_telemetry_summary(db: Session, user_id: str) -> Dict[str, Any]:
        total_events = db.query(m.LearningEvent).filter(m.LearningEvent.user_id == user_id).count()
        attempts = db.query(m.Attempt).filter(m.Attempt.user_id == user_id).all()
        
        success_count = sum(1 for a in attempts if a.is_successful)
        total_attempts = len(attempts)
        accuracy = (success_count / total_attempts) if total_attempts > 0 else 0.0"""

new_func = """    @staticmethod
    def get_learner_telemetry_summary(db: Session, user_id: str) -> Dict[str, Any]:
        total_events = db.query(m.LearningEvent).filter(m.LearningEvent.user_id == user_id).count()
        attempts = db.query(m.Attempt).filter(m.Attempt.user_id == user_id).all()
        
        success_count = sum(1 for a in attempts if a.result == 'PASS' or a.score >= 0.7)
        total_attempts = len(attempts)
        accuracy = (success_count / total_attempts) if total_attempts > 0 else 0.0"""

code = code.replace(old_func, new_func)
with open('backend/app/services/telemetry_service.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated TelemetryService accuracy computation!')
