# Deployable MVP Task Tracker & Alignment Roadmap

> **Target**: Bridge all disconnected mock views to authoritative FastAPI backend engines to deliver a deployable, role-aligned Learning OS MVP.

---

## Task Progress Checklist

### [Phase 1] Core Auth & Role Stability Fixes (P0)
- [x] **Fix Role Typo in Header**: Updated `src/components/NavigationBar.jsx` so `isAdmin` displays "Root Administrator" instead of defaulting to "Student".
- [x] **Normalize User & Entitlements**: In `src/context/AuthContext.jsx`, `normalizeUser` guarantees `unlockedModules: ['module-1']` default and preserves local state and backend user data.
- [x] **Route Protection**: Added redirect guards in `src/app/learner/profile/page.jsx` and `src/app/missions/page.jsx` redirecting unauthenticated users to `/auth`.

---

### [Phase 2] Student Learning & Gatekeeper Integration (P0)
- [x] **Defensive Array Checks in Workspace**: Handled safe `unlockedModules` array access with default fallbacks in `src/app/learn/[courseId]/[moduleId]/[lessonId]/page.jsx`.
- [x] **Connect Gatekeeper Quiz to Backend**: In `AuthContext.jsx` and `LearningWorkspace`, connected quiz passing to `POST /api/v1/tracks/modules/{moduleId}/bypass-exam`.
- [x] **Connect Paid Bypass to Backend**: Wired payment bypass completion directly to `POST /api/v1/tracks/modules/{moduleId}/bypass-pay`.
- [x] **Dynamic Courses Catalog**: Updated `src/app/courses/page.jsx` to fetch `GET /api/v1/courses` with fallback to bundled `data/courses.json`.

---

### [Phase 3] Live Adaptive Missions Loop (P1)
- [x] **Remove Mock `setTimeout`**: In `src/app/missions/page.jsx`, start session via `POST /api/v1/sessions/start`.
- [x] **Fetch Adaptive Mission Step**: In `src/app/missions/page.jsx`, call `GET /api/v1/sessions/{session_id}/mission` to retrieve real next-best-action activity and explainability formula.
- [x] **Wire Live Evidence Collection**: When user interacts with the cognitive block, send results to `POST /api/v1/sessions/{session_id}/evidence`.
- [x] **Real-time Feedback & Mastery Gain**: Calculate delta based on returned recommendation state.

---

### [Phase 4] Dynamic Learner Profile & Retention State (P1)
- [x] **Fetch Authoritative Learner Profile**: Connected `src/app/learner/profile/page.jsx` to `GET /api/v1/learner/profile`.
- [x] **Dynamic Multi-Dimensional Mastery**: Multi-dimensional mastery vectors, challenge bias, and user initials rendered dynamically.
- [x] **Live Curiosity Signals**: Connected curiosity signals to `GET /api/v1/curiosity/radar`.
- [x] **Promote to Goal**: Wired "Promote to Goal" button to `POST /api/v1/goals`.

---

### [Phase 5] Knowledge Graph Studio & Overrides in Admin (P1)
- [x] **Knowledge Graph Curation Tab**: Added tab in `src/app/admin/page.jsx` allowing Super Admins to view domains, add concepts (`POST /api/v1/admin/concepts`), and add prerequisite relation edges (`POST /api/v1/admin/relations`).
- [x] **Learner Diagnostic Override Form**: Added panel in `src/app/admin/page.jsx` allowing manual mastery adjustments via `POST /api/v1/admin/overrides/mastery`.

---

### [Phase 6] Capstone Projects Submission (P2)
- [x] **Project View**: Created `src/app/projects/page.jsx` listing active user capstone tasks from `GET /api/v1/projects`.
- [x] **Artifact Submission**: Added code and rationale submission handler submitting to `POST /api/v1/projects/tasks/{id}/submit`.
- [x] **Navigation Integration**: Added links to Capstones, Missions, and Profile in `NavigationBar.jsx`.

---

### [Phase 7] Validation & Deployment Build (P0)
- [x] Validate backend FastAPI application startup: `python -c "import backend.app.main as m; print(m.app.title)"` (exited 0).
- [x] Run frontend production build validation: `npm run build` (compiled 22 static and dynamic routes successfully in 33.3s).
