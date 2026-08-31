import os

os.makedirs('backend/app/simulation', exist_ok=True)
with open('backend/app/simulation/__init__.py', 'w', encoding='utf-8') as f:
    f.write('# Adaptive Simulation & Synthetic Validation Package\n')

print('Created backend/app/simulation directory!')
