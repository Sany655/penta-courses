import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 13 — Admin Control Panel & Knowledge Engineering
- [ ] Implement Domain & Concept CRUD admin service
- [ ] Implement Concept Graph Relation Editor with Cycle Prevention
- [ ] Implement Manual Learner Mastery Override & Audit Logging
- [ ] Implement Dynamic Pricing & Module Bypass Fee Management
- [ ] REST API endpoints for Admin Workbench
- [ ] Unit & Integration tests for Admin Service''',
'''## Phase 13 — Admin Control Panel & Knowledge Engineering
- [x] Implement Domain & Concept CRUD admin service
- [x] Implement Concept Graph Relation Editor with Cycle Prevention
- [x] Implement Manual Learner Mastery Override & Audit Logging
- [x] Implement Dynamic Pricing & Module Bypass Fee Management
- [x] REST API endpoints for Admin Workbench
- [x] Unit & Integration tests for Admin Service'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 13 (Admin Control Panel & Knowledge Engineering) Complete
* Next Phase: Phase 14 (Monetization, Commerce & Stripe/bKash Integration)
* Status: Complete and Verified (22/22 backend tests passing)
* Last Updated: 2026-08-31

## Phase 13 Summary
* AdminService (backend/app/services/admin_service.py):
  - Full Knowledge Engineering controls: Domain & Concept upserts, metadata management.
  - DAG Relation connector with automatic cycle detection prevention.
  - Granular learner mastery overrides with immutable audit logs in admin_audit_logs.
  - Dynamic monetization and bypass pricing configuration.
* REST API endpoints:
  - GET /api/v1/admin/stats
  - POST /api/v1/admin/domains
  - POST /api/v1/admin/concepts
  - POST /api/v1/admin/relations
  - POST /api/v1/admin/overrides/mastery
  - POST /api/v1/admin/commerce/pricing
* Test Suite Status: 22 passed in 18.39s.
''')

print('Phase 13 recorded in TODO and STATE!')
