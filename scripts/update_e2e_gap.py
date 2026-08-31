import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("assert len(gap_analysis['target_concept_ids']) >= 1", "assert gap_analysis['total_concepts'] >= 1")
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated gap_analysis assertion in test_end_to_end_integration.py!')
