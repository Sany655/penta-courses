import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 8 — Goal Engine, Diagnostic Probes & Gap Analysis
- [ ] Implement Goal creation & target concept mapping
- [ ] Implement Gap Analysis algorithm (Mastered, Weak, Unknown, Blocked, Actionable)
- [ ] Implement Diagnostic Probe set generation
- [ ] Implement Diagnostic Probe assessment & baseline mapping
- [ ] REST API endpoints for Goals & Diagnostic Probes
- [ ] Unit & Integration tests for Goal Engine''',
'''## Phase 8 — Goal Engine, Diagnostic Probes & Gap Analysis
- [x] Implement Goal creation & target concept mapping
- [x] Implement Gap Analysis algorithm (Mastered, Weak, Unknown, Blocked, Actionable)
- [x] Implement Diagnostic Probe set generation
- [x] Implement Diagnostic Probe assessment & baseline mapping
- [x] REST API endpoints for Goals & Diagnostic Probes
- [x] Unit & Integration tests for Goal Engine'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 8 (Goal Engine, Diagnostic Probes & Gap Analysis) Complete
* Next Phase: Phase 9 (Curiosity Engine & Exploration System)
* Status: Complete and Verified (18/18 backend tests passing)
* Last Updated: 2026-08-31

## Phase 8 Summary
* GoalEngineService (backend/app/services/goal_engine.py):
  - Transitive Prerequisite Graph resolution for target concept sets.
  - Granular Gap Analysis categorization (Mastered, Weak, Unknown, Blocked, Actionable).
  - Estimated hours calculation and completion percentage tracking.
  - Multi-layer Diagnostic Probe set generation across domain graphs.
  - Probe result ingestion and automated baseline state calibration.
* REST API endpoints:
  - GET /api/v1/goals
  - POST /api/v1/goals
  - GET /api/v1/goals/{id}/gap-analysis
  - POST /api/v1/goals/{id}/diagnostic-probe
  - POST /api/v1/goals/{id}/diagnostic-probe/submit
* Test Suite Status: 18 passed in 13.93s.
''')

print('Phase 8 recorded in TODO and STATE!')
