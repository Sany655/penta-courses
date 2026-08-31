import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_step4 = """    # Step 4: Deterministic Adaptive Decision Engine
    rec = AdaptiveEngineService.select_next_activity(db, student.id, med_domain.id)
    assert rec is not None
    assert rec.candidate_activity is not None"""

new_step4 = """    # Step 4: Deterministic Adaptive Decision Engine
    rec = AdaptiveEngineService.generate_recommendation(db, student.id, med_domain.id)
    assert rec is not None
    assert rec['action'] is not None
    assert rec['target']['concept_id'] is not None"""

code = code.replace(old_step4, new_step4)
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated step 4 in test_end_to_end_integration.py!')
