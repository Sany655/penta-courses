import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_code = """    eval_res = ProjectEngineService.evaluate_milestone_task(
        db, student.id, t1.id,
        submission_data={'score': 1.0, 'verified': True, 'protocol_steps': ['Insulin', 'Saline', 'KCl']}
    )
    assert eval_res['passed'] is True
    assert eval_res['task_status'] == 'VERIFIED'"""

new_code = """    eval_res = ProjectEngineService.submit_task_solution(
        db, student.id, t1.id,
        submission_data={'score': 1.0, 'verified': True, 'protocol_steps': ['Insulin', 'Saline', 'KCl']}
    )
    assert eval_res['status'] == 'VERIFIED'
    assert eval_res['project_completed'] is True"""

code = code.replace(old_code, new_code)
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated submit_task_solution in test_end_to_end_integration.py!')
