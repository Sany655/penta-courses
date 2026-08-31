import os

with open('backend/app/services/telemetry_service.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_code = """        event = m.LearningEvent(
            user_id=user_id,
            session_id=session_id,
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            payload_json=payload or {},
            created_at=datetime.now(timezone.utc)
        )"""

new_code = """        event = m.LearningEvent(
            user_id=user_id,
            session_id=session_id,
            event_type=event_type,
            entity_type=entity_type or 'ACTIVITY',
            entity_id=entity_id or 'global',
            payload_json=payload or {},
            timestamp=datetime.now(timezone.utc)
        )"""

code = code.replace(old_code, new_code)
with open('backend/app/services/telemetry_service.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated TelemetryService LearningEvent fields!')
