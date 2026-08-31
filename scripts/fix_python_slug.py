import os

with open('backend/tests/test_adaptive_policy_validation.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('m.Domain.slug.like("%python-systems%")', 'm.Domain.slug.like("%python%")')
with open('backend/tests/test_adaptive_policy_validation.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated python domain slug match in test_adaptive_policy_validation.py!')
