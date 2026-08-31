import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 9 — Curiosity Engine & Exploration System
- [ ] Implement Curiosity signal capture & interest scoring
- [ ] Implement Exploration Radar list & status tracking
- [ ] Implement Exploration to Goal promotion
- [ ] Implement Tangent mission discovery
- [ ] REST API endpoints for Curiosity & Radar
- [ ] Unit & Integration tests for Curiosity Engine''',
'''## Phase 9 — Curiosity Engine & Exploration System
- [x] Implement Curiosity signal capture & interest scoring
- [x] Implement Exploration Radar list & status tracking
- [x] Implement Exploration to Goal promotion
- [x] Implement Tangent mission discovery
- [x] REST API endpoints for Curiosity & Radar
- [x] Unit & Integration tests for Curiosity Engine'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 9 (Curiosity Engine & Exploration System) Complete
* Next Phase: Phase 10 (Capstone Project & Applied Creation Mode Engine)
* Status: Complete and Verified (19/19 backend tests passing)
* Last Updated: 2026-08-31

## Phase 9 Summary
* CuriosityEngineService (backend/app/services/curiosity_engine.py):
  - Natural curiosity signal ingestion with automatic frequency & interest score amplification.
  - Exploration Radar categorizing topics across CAPTURED, PARKED, EXPLORING, PROMOTED, DISMISSED.
  - One-click promotion from exploration radar item to structured domain Goal.
  - Tangent mission generator finding conceptual adjacencies without losing mission focus.
* REST API endpoints:
  - GET /api/v1/curiosity/radar
  - POST /api/v1/curiosity/capture
  - POST /api/v1/curiosity/{id}/promote
  - GET /api/v1/curiosity/tangents
* Test Suite Status: 19 passed in 18.04s.
''')

print('Phase 9 recorded in TODO and STATE!')
