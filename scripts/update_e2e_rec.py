import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("assert rec['target']['concept_id'] is not None", "assert rec['target']['id'] is not None")
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated rec target id assertion in test_end_to_end_integration.py!')
