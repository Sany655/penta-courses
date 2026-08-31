import os

with open('backend/app/models/__init__.py', 'r', encoding='utf-8') as f:
    code = f.read()

if 'RecommendationAudit' not in code:
    code = code.replace(
        'Project, ProjectTask, EvidenceType, FailureCategory',
        'Project, ProjectTask, EvidenceType, FailureCategory, RecommendationAudit'
    )
    with open('backend/app/models/__init__.py', 'w', encoding='utf-8') as f:
        f.write(code)
    print('Exported RecommendationAudit in __init__.py!')
else:
    print('Already exported.')
