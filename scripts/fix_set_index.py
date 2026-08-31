import os

with open('backend/app/services/adaptive_engine.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("prereq_concept_id = prereqs[0]", "prereq_concept_id = list(prereqs)[0]")
with open('backend/app/services/adaptive_engine.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Fixed set indexing in diagnose_failure_and_repair!')
