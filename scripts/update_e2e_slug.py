import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("m.Domain.slug == 'clinical-medicine'", "m.Domain.slug.like('%clinical-medicine%')")
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated slug query in test_end_to_end_integration.py!')
