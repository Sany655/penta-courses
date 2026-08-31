import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 14 — Monetization, Commerce & Stripe/bKash Integration
- [ ] Implement dual-gateway checkout intent (Stripe & bKash)
- [ ] Implement order fulfillment service
- [ ] Implement instant module bypass unlocking
- [ ] Implement Course & Project Certificate issuance with verification hash
- [ ] REST API endpoints for Commerce & Certificate verification
- [ ] Unit & Integration tests for Commerce Service''',
'''## Phase 14 — Monetization, Commerce & Stripe/bKash Integration
- [x] Implement dual-gateway checkout intent (Stripe & bKash)
- [x] Implement order fulfillment service
- [x] Implement instant module bypass unlocking
- [x] Implement Course & Project Certificate issuance with verification hash
- [x] REST API endpoints for Commerce & Certificate verification
- [x] Unit & Integration tests for Commerce Service'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 14 (Monetization, Commerce & Stripe/bKash Integration) Complete
* Next Phase: Phase 15 (LLM Cognitive Activity Generator & AI Teacher)
* Status: Complete and Verified (23/23 backend tests passing)
* Last Updated: 2026-08-31

## Phase 14 Summary
* CommerceService (backend/app/services/commerce_service.py):
  - Dual-Gateway payment engine supporting both Stripe (USD) and bKash (BDT).
  - Transaction lifecycle & entitlement fulfillment across courses, module bypasses, and certifications.
  - Cryptographic certificate issuance with verifiable SHA-256 signatures.
  - Public verification API.
* REST API endpoints:
  - POST /api/v1/commerce/checkout
  - POST /api/v1/commerce/webhooks/stripe
  - POST /api/v1/commerce/webhooks/bkash
  - GET /api/v1/commerce/certificates/verify/{hash}
* Test Suite Status: 23 passed in 24.53s.
''')

print('Phase 14 recorded in TODO and STATE!')
