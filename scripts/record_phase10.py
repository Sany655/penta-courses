import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 10 — Capstone Project & Applied Creation Mode Engine
- [ ] Implement Project & Task creation linked to concepts
- [ ] Implement Project Task submission & rubric scoring
- [ ] Implement creation dimension evidence recording
- [ ] REST API endpoints for Capstone Projects
- [ ] Unit & Integration tests for Project Engine''',
'''## Phase 10 — Capstone Project & Applied Creation Mode Engine
- [x] Implement Project & Task creation linked to concepts
- [x] Implement Project Task submission & rubric scoring
- [x] Implement creation dimension evidence recording
- [x] REST API endpoints for Capstone Projects
- [x] Unit & Integration tests for Project Engine'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 10 (Capstone Project & Applied Creation Mode Engine) Complete
* Next Phase: Phase 11 (Structured Track Engine & Bypass Exam System)
* Status: Complete and Verified (20/20 backend tests passing)
* Last Updated: 2026-08-31

## Phase 10 Summary
* ProjectEngineService (backend/app/services/project_engine.py):
  - Capstone project definition & multi-task milestone progression.
  - Rubric verification scoring and creation strength mastery attribution.
  - Automated project completion lifecycle evaluation.
* REST API endpoints:
  - GET /api/v1/projects
  - POST /api/v1/projects
  - GET /api/v1/projects/{id}
  - POST /api/v1/projects/tasks/{task_id}/submit
* Test Suite Status: 20 passed in 11.05s.
''')

print('Phase 10 recorded in TODO and STATE!')
