# Production Release Checklist

Status: **Ready for staging verification**

## Build and code

- [x] `npm run build` passes.
- [x] Focused Oxlint passes with only existing Fast Refresh warnings.
- [x] Python modules compile.
- [x] No active Firebase or NextAuth dependencies remain.
- [x] `git diff --check` passes.
- [ ] Add and run automated backend API tests.

## Configuration

- [ ] `DATABASE_URL` points to the managed production PostgreSQL database.
- [ ] `SECRET_KEY` is a strong unique production secret.
- [ ] `JWT_SECRET` is a strong unique production secret.
- [ ] `ENVIRONMENT=production` is set for the backend.
- [ ] `NEXT_PUBLIC_API_URL` contains the API origin only, without `/api`.
- [ ] `CORS_ORIGINS` contains the exact frontend origins.
- [ ] Gemini, Stripe, and bKash secrets are configured only server-side.

## Database

- [ ] Back up the current production database.
- [ ] Verify the existing schema before `alembic stamp 20260907_baseline`.
- [ ] Run `python -m alembic upgrade head` from `backend/`.
- [ ] Run seed data only when appropriate for the target environment.
- [ ] Confirm inquiry, transaction, entitlement, certificate, and audit tables.
- [ ] Rehearse restore from backup in staging.

## Authentication and authorization

- [ ] Register a student account.
- [ ] Log in and restore the session after refresh.
- [ ] Confirm invalid credentials return `401`.
- [ ] Confirm student access to admin endpoints returns `403`.
- [ ] Confirm public registration cannot assign an elevated role.
- [ ] Confirm expired/invalid JWTs are rejected.

## Core workflows

- [ ] Submit and review a contact inquiry.
- [ ] Submit a manual bKash payment and reject it.
- [ ] Approve a payment and verify entitlement creation.
- [ ] Generate and save an admin lesson.
- [ ] Start a learning session and submit an attempt.
- [ ] Verify telemetry and learner-state updates.
- [ ] Verify a certificate publicly.
- [ ] Click the frontend server status control while API/database are healthy and degraded.

## Operations

- [ ] Configure `/health` monitoring.
- [ ] Configure database backup schedule.
- [ ] Configure Stripe and bKash webhook URLs.
- [ ] Confirm logs include request IDs and response timing.
- [ ] Document rollback for frontend, backend, and database migrations.
