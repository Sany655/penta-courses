import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("required_concepts_json=[c_dka.id]", "required_concepts=[c_dka.id]")
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated ProjectTask in test_end_to_end_integration.py!')
