import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("assert bypass_res['bypassed'] is True", "assert bypass_res['status'] == 'UNLOCKED'")
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated bypass status assertion in test_end_to_end_integration.py!')
