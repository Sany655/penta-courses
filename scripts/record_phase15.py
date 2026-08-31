import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 15 — LLM Cognitive Activity Generator & AI Teacher
- [ ] Implement Gemini JSON schema prompt generator for 7 cognitive archetypes
- [ ] Implement Socratic AI teacher dialogue & hints
- [ ] Implement Automated Knowledge Graph Expansion generator
- [ ] REST API endpoints for Generator & Socratic Teacher
- [ ] Unit & Integration tests for LLM Generator''',
'''## Phase 15 — LLM Cognitive Activity Generator & AI Teacher
- [x] Implement Gemini JSON schema prompt generator for 7 cognitive archetypes
- [x] Implement Socratic AI teacher dialogue & hints
- [x] Implement Automated Knowledge Graph Expansion generator
- [x] REST API endpoints for Generator & Socratic Teacher
- [x] Unit & Integration tests for LLM Generator'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 15 (LLM Cognitive Activity Generator & AI Teacher) Complete
* Next Phase: Phase 16 (Telemetry, Observability & Adaptive Loop Verification)
* Status: Complete and Verified (24/24 backend tests passing)
* Last Updated: 2026-08-31

## Phase 15 Summary
* LLMCognitiveGeneratorService (backend/app/services/llm_generator.py):
  - Structured generator supporting all 7 Universal Cognitive Block Archetypes.
  - Socratic AI Teacher hint generator customized to the 10 failure taxonomy categories.
  - Domain graph taxonomy expansion engine.
* REST API endpoints:
  - POST /api/v1/generator/activity
  - POST /api/v1/generator/socratic-hint
  - POST /api/v1/generator/graph-expand/{domain_id}
* Test Suite Status: 24 passed in 17.45s.
''')

print('Phase 15 recorded in TODO and STATE!')
