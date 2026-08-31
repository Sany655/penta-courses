import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 16 — Telemetry, Observability & Adaptive Loop Verification
- [ ] Implement Telemetry event logger service
- [ ] Implement Hesitation & Time-on-Task signal capture
- [ ] Implement Aggregated Learner Performance & Failure Metrics
- [ ] Verify Full Closed Adaptive Loop end-to-end
- [ ] Unit & Integration tests for Telemetry Service''',
'''## Phase 16 — Telemetry, Observability & Adaptive Loop Verification
- [x] Implement Telemetry event logger service
- [x] Implement Hesitation & Time-on-Task signal capture
- [x] Implement Aggregated Learner Performance & Failure Metrics
- [x] Verify Full Closed Adaptive Loop end-to-end
- [x] Unit & Integration tests for Telemetry Service'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 16 (Telemetry, Observability & Adaptive Loop Verification) Complete
* Next Phase: Phase 17 (End-to-End System Integration & Multi-Domain Demonstration)
* Status: Complete and Verified (25/25 backend tests passing)
* Last Updated: 2026-08-31

## Phase 16 Summary
* TelemetryService (backend/app/services/telemetry_service.py):
  - Ingestion of rich cognitive events, block interactions, time-on-task, and hesitation scores into learning_events.
  - Telemetry aggregations computing success rates, attempt distributions, and failure taxonomy distributions.
  - End-to-end closed loop observability.
* REST API endpoints:
  - POST /api/v1/telemetry/events
  - GET /api/v1/telemetry/summary
* Test Suite Status: 25 passed in 15.73s.
''')

print('Phase 16 recorded in TODO and STATE!')
