# Implementation State

## Current assessment

The platform is implemented as a working hybrid adaptive-learning application with a Next.js client and FastAPI backend. The repository is buildable, but “production ready” is conditional on environment configuration, database migration, provider webhooks, and end-to-end staging verification.

## Completed

- Global navigation and mobile menu consolidation.
- Fixed-header spacing and server health indicator.
- Backend-owned JWT registration, login, session restore, and logout.
- Server-controlled roles; public registration always creates `STUDENT`.
- FastAPI adaptive learning, goals, sessions, tracks, projects, telemetry, sync, and generator route groups.
- SQLAlchemy relational model set for identity, content, learner state, sessions, evidence, commerce, certificates, audit, events, and inquiries.
- Persistent inquiries and manual bKash transaction review.
- Backend admin lesson generation and lesson persistence.
- Removal of active Firebase and NextAuth application dependencies.
- Alembic baseline and inquiry migration.
- UI/UX and deployment documentation aligned with the current source tree.

## Verification completed in this workspace

- `npm run build`: passed.
- Focused Oxlint checks: passed with existing Fast Refresh warnings in `AuthContext`.
- Python module compilation: passed.
- Alembic fresh-database chain: passed through `20260907_add_inquiries` using isolated SQLite validation.
- `pytest`: no tests were collected in the repository at the time of verification.

## Production blockers and risks

1. Apply migrations to the actual production database after verifying the existing schema.
2. Configure `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`, `CORS_ORIGINS`, and provider secrets.
3. Run staging registration, login, role authorization, inquiry, payment, lesson-authoring, and certificate verification flows.
4. Add automated backend API tests; the current repository does not contain the previously claimed 26-test suite.
5. Review the current PBKDF2-SHA256 password-hash implementation before a large production user migration. It is server-controlled but should receive a versioned hash format and per-user salt in a future security hardening pass.
6. Configure provider webhooks and confirm idempotent fulfillment against staging transactions.

## Remaining intentionally local state

Theme preference, hero presentation settings, and unsaved authoring drafts remain browser-local because they are presentation state. Business state such as identity, mastery, inquiries, payments, entitlements, lessons, and telemetry is backend-owned.

## Release gate

A release can be called production-ready only after the production database migration, environment validation, staging smoke tests, provider webhook verification, and automated API test coverage are complete.
