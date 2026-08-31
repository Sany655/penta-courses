import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('from backend.app.seeds.seed_data import seed_production_knowledge_graphs', 'from backend.app.seeds.seed_data import seed_all')
code = code.replace('seed_production_knowledge_graphs(session)', 'seed_all()')

with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated seed_all import in test_end_to_end_integration.py!')
