import os

with open('backend/tests/test_end_to_end_integration.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("CuriosityEngineService.get_exploration_radar", "CuriosityEngineService.list_exploration_radar")
with open('backend/tests/test_end_to_end_integration.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated curiosity method in test_end_to_end_integration.py!')
