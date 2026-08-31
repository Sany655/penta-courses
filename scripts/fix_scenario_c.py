import os

with open('backend/tests/test_adaptive_policy_validation.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_c = """    # Simulate attempt with misconception
    attempt = m.Attempt(
        user_id=user.id,
        activity_id=act_hagma.id,
        result="FAIL",
        score=0.25,
        error_type="PREREQUISITE_MISCONCEPTION"
    )"""

new_c = """    sess = m.LearningSession(user_id=user.id, domain_id=domain.id, status="ACTIVE")
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
    )"""

code = code.replace(old_c, new_c)
with open('backend/tests/test_adaptive_policy_validation.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated Scenario C session in test_adaptive_policy_validation.py!')
