import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("exam_score=0.90", "responses=[{'score': 0.90}]")
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated evaluate_module_bypass_exam in test_end_to_end_integration.py!')
