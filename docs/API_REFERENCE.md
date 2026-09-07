# API Reference

## Service Contract

- Base path: `/api/v1`
- Transport: JSON over HTTPS
- Authentication: `Authorization: Bearer <access_token>`
- Public routes: catalog, certificate verification, health, and inquiry submission.
- Protected routes: learner data, sessions, telemetry, commerce, generator, sync, and admin operations.
- Role protection is enforced by FastAPI dependencies, not by frontend visibility alone.

```mermaid
flowchart TB
    Client[Next.js client] --> Auth[/auth/register<br/>/auth/login<br/>/auth/me/]
    Client --> Learning[/domains /courses /goals<br/>/adaptive /sessions /tracks/]
    Client --> Commerce[/commerce/checkout<br/>/commerce/manual-payments/]
    Client --> Admin[/admin/*]
    Auth --> DB[(Authoritative database)]
    Learning --> DB
    Commerce --> DB
    Admin --> DB
```

## Authentication

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a `STUDENT` user and return JWT |
| POST | `/auth/login` | Public | Verify credentials and return JWT |
| POST | `/auth/token` | Public | OAuth2 form-compatible token endpoint |
| GET | `/auth/me` | Bearer | Return the current user |

Registration ignores client-provided roles. Passwords are hashed by the backend and the frontend stores the returned access token as `penta_access_token`.

## Catalog and Knowledge

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/domains` | Public | List domains |
| GET | `/domains/{domain_id}` | Public | Read a domain |
| GET | `/domains/{domain_id}/graph` | Public/Bearer overlay | Read graph nodes and relations |
| GET | `/courses` | Public | List courses |
| GET | `/courses/{course_id}` | Public | Read course structure |
| GET | `/tracks/courses` | Public | List published structured tracks |
| GET | `/tracks/courses/{course_id}/progress` | Bearer | Read learner track progress |

## Goals and Adaptive Learning

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/goals` | Bearer | List learner goals |
| POST | `/goals` | Bearer | Create a goal |
| GET | `/goals/{goal_id}/gap-analysis` | Bearer | Calculate graph gaps |
| POST | `/goals/{goal_id}/diagnostic-probe` | Bearer | Generate a probe |
| POST | `/goals/{goal_id}/diagnostic-probe/submit` | Bearer | Submit probe results |
| GET | `/adaptive/recommendation/{domain_id}` | Bearer | Get the next explainable recommendation |
| GET | `/learner/profile` | Bearer | Read the learner profile |
| GET | `/learner/domains/{domain_id}` | Bearer | Read domain mastery |
| GET | `/learner/concepts/{concept_id}` | Bearer | Read concept mastery |

## Sessions, Tracks, and Projects

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/sessions/start` | Bearer | Start a learning session |
| GET | `/sessions/{session_id}/mission` | Bearer | Read the current mission |
| POST | `/sessions/{session_id}/attempt` | Bearer | Submit an activity attempt |
| POST | `/sessions/{session_id}/complete` | Bearer | Complete a session |
| POST | `/tracks/modules/{module_id}/bypass-exam` | Bearer | Evaluate a bypass exam |
| POST | `/tracks/modules/{module_id}/bypass-pay` | Bearer | Apply a paid bypass transaction |
| GET | `/projects` | Bearer | List capstone projects |
| POST | `/projects` | Bearer | Create a project |
| GET | `/projects/{project_id}` | Bearer | Read a project |
| POST | `/projects/tasks/{task_id}/submit` | Bearer | Submit project evidence |

## Curiosity, Generator, Telemetry, and Sync

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/curiosity/radar` | Bearer | Read exploration items |
| POST | `/curiosity/capture` | Bearer | Capture a curiosity signal |
| POST | `/curiosity/{item_id}/promote` | Bearer | Promote an exploration item |
| GET | `/curiosity/tangents` | Bearer | List tangent missions |
| POST | `/generator/activity` | Bearer | Generate a cognitive activity |
| POST | `/generator/socratic-hint` | Bearer | Generate a Socratic hint |
| POST | `/generator/graph-expand/{domain_id}` | Bearer | Generate graph candidates |
| POST | `/telemetry/events` | Bearer | Ingest learning events |
| GET | `/telemetry/summary` | Bearer | Read telemetry summary |
| POST | `/sync/push` | Bearer | Push client events |
| GET | `/sync/pull` | Bearer | Pull authoritative deltas |

## Commerce and Certificates

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/commerce/products` | Public | Read product catalog |
| POST | `/commerce/checkout` | Bearer | Create a provider checkout transaction |
| POST | `/commerce/manual-payments` | Bearer | Submit a manual bKash transaction |
| POST | `/commerce/webhooks/stripe` | Provider | Fulfill a Stripe event |
| POST | `/commerce/webhooks/bkash` | Provider | Fulfill a bKash event |
| GET | `/commerce/certificates/verify/{hash}` | Public | Verify a certificate |

A successful transaction creates an entitlement or enrollment through the fulfillment service. Manual bKash transaction references are unique.

## Inquiries

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/inquiries` | Public | Persist a contact or enterprise inquiry |

Inquiry administration is under `/admin/inquiries`.

## Admin and RBAC

Admin routes require one of `SUPER_ADMIN`, `CONTENT_ADMIN`, `AI_ADMIN`, `COMMERCE_ADMIN`, or `INSTRUCTOR`, depending on the operation.

| Method | Path | Purpose |
|---|---|---|
| GET | `/admin/stats` | System overview |
| POST | `/admin/domains` | Create/update a domain |
| POST | `/admin/concepts` | Create/update a concept |
| POST | `/admin/relations` | Add a prerequisite relation |
| POST | `/admin/overrides/mastery` | Override mastery with audit context |
| POST | `/admin/commerce/pricing` | Update pricing |
| POST | `/admin/lessons/generate` | Generate authoring blocks |
| POST | `/admin/lessons` | Persist a lesson |
| GET | `/admin/inquiries` | Filter/search inquiries |
| PATCH | `/admin/inquiries/{id}` | Update inquiry status |
| DELETE | `/admin/inquiries/{id}` | Delete an inquiry |
| GET | `/admin/commerce/payments` | List payment records |
| POST | `/admin/commerce/payments/{id}/approve` | Fulfill a payment |
| POST | `/admin/commerce/payments/{id}/reject` | Mark a payment failed |
| DELETE | `/admin/commerce/payments/{id}` | Delete a payment record |
| POST | `/admin/commerce/grants` | Grant a module entitlement |

## System Diagnostics

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/system/info` | Public | Platform metadata and entity counts |
| GET | `/system/health` | Public | API/database health |
| GET | `/health` | Public | Deployment health used by the frontend status button |

## Error Contract

FastAPI validation errors use HTTP `422`. Authentication failures use `401`; insufficient role uses `403`; missing resources use `404`; duplicate transaction references use `409`; business-rule failures use `400`.

```json
{
  "detail": "Human-readable error message"
}
```
