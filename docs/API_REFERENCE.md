# API Reference — Unified Hybrid Adaptive Learning Platform

Base URL: `/api/v1`

---

## 1. Authentication & Learner Profile
- `POST /auth/register`: Register new student or admin.
- `POST /auth/token`: Authenticate and obtain JWT bearer token.
- `GET /learner/profile`: Retrieve active learner 5-D mastery vectors, radar, and retention schedule.
- `PUT /learner/profile`: Update learning mode preference (`HYBRID`, `STRUCTURED_ONLY`, `ADAPTIVE_ONLY`) and challenge preference $[0.0, 1.0]$.

---

## 2. Knowledge Graph & Domains
- `GET /domains`: List published knowledge domains (e.g., Medicine, Law, Economics, Python Systems).
- `GET /domains/{domain_id}/graph`: Retrieve topological DAG nodes, directed edges, prerequisite relations, and learner status overlays.

---

## 3. Goals & Diagnostic Probes
- `POST /goals`: Create a self-directed learning goal with target concepts.
- `GET /goals`: List all active and completed learner goals.
- `GET /goals/{goal_id}/gap-analysis`: Topological graph gap analysis (actionable frontier, blocked concepts, estimated effort).
- `POST /goals/{goal_id}/probes`: Generate diagnostic probe activities to rapidly baseline mastery across prerequisite trees.

---

## 4. Adaptive Learning Engine & Sessions
- `GET /adaptive/recommendation?domain_id={id}`: Generate explainable next-activity recommendation with 10-factor candidate weights.
- `POST /sessions`: Start or resume an adaptive learning session.
- `POST /sessions/{session_id}/attempts`: Submit an activity attempt, trigger deterministic scoring, and update 5-D competence vectors.
- `POST /sessions/{session_id}/repair`: Trigger closed-loop prerequisite repair when an attempt fails.

---

## 5. Curiosity & Exploration Radar
- `POST /curiosity/signals`: Capture micro-signals (hover, search queries, tangents) to populate the Exploration Radar.
- `GET /curiosity/radar`: List active exploratory curiosity items with interest scores.
- `POST /curiosity/tangents`: Convert curiosity item into an adaptive tangent learning mission.

---

## 6. Structured Tracks & Bypass Exams
- `GET /tracks/{course_id}/outline`: Retrieve structured course outline with module status, lesson completion, and lock states.
- `POST /tracks/modules/{module_id}/bypass-exam`: Evaluate module bypass exam responses and unlock downstream modules upon $\ge 80\%$ score.
- `POST /tracks/modules/{module_id}/paid-bypass`: Unlock module instantly through entitlement/transaction record.

---

## 7. Applied Capstone Projects
- `GET /projects`: List available multi-task capstone projects.
- `GET /projects/{project_id}`: Retrieve project details, rubric requirements, and milestone tasks.
- `POST /projects/tasks/{task_id}/submit`: Submit milestone task solution, evaluate rubric criteria, and record Creation evidence.

---

## 8. Commerce & Certificates
- `POST /commerce/checkout`: Create a checkout transaction for courses, module bypasses, or certificates (Stripe USD or bKash BDT).
- `POST /commerce/fulfill`: Fulfill transaction and grant entitlements.
- `GET /commerce/certificates/verify/{hash}`: Public cryptographic SHA-256 certificate verification.

---

## 9. Admin Knowledge Workbench
- `POST /admin/domains`: Create or update knowledge domain.
- `POST /admin/concepts`: Create or update concept nodes.
- `POST /admin/graph/edges`: Add directed prerequisite edge with cycle-detection prevention (`validate_graph_acyclic`).
- `POST /admin/mastery-override`: Manually override learner concept state with immutable audit trail.
- `PUT /admin/courses/{course_id}/pricing`: Update course price and module bypass fees.

---

## 10. LLM Cognitive Activity Generator & AI Teacher
- `POST /generator/generate-activity`: Generate structured cognitive activity across 7 archetypes from concept definition.
- `POST /generator/socratic-hint`: Generate Socratic hints tailored to the 10 failure taxonomy categories.
- `POST /generator/expand-taxonomy`: Generate candidate concept expansions and prerequisite edges.

---

## 11. Telemetry & Closed-Loop Observability
- `POST /telemetry/events`: Ingest rich block interactions, hesitation scores, and time-on-task.
- `GET /telemetry/summary`: Retrieve learner telemetry summary, success rate, and failure taxonomy distributions.

---

## 12. System Health & Diagnostics
- `GET /system/info`: Retrieve system metadata, registered archetypes, and DB entity counts.
- `GET /system/health`: Verify live database connectivity.
