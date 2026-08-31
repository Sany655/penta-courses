import os

dirs = [
    'src/app/missions',
    'src/app/knowledge-graph',
    'src/app/learner/profile',
    'src/app/tracks/[courseId]'
]
for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f'Created {d}')
