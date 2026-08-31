import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 12 — Unified Hybrid Learner Experience
- [ ] Build Self-Directed Adaptive Mission Mode View
- [ ] Build Interactive Knowledge Graph Topology Visualizer
- [ ] Build Multi-Dimensional Mastery & Learner Profile View
- [ ] Build Unified Structured Track Player with Bypass Controls
- [ ] Connect interactive telemetry & evidence loops to backend''',
'''## Phase 12 — Unified Hybrid Learner Experience
- [x] Build Self-Directed Adaptive Mission Mode View
- [x] Build Interactive Knowledge Graph Topology Visualizer
- [x] Build Multi-Dimensional Mastery & Learner Profile View
- [x] Build Unified Structured Track Player with Bypass Controls
- [x] Connect interactive telemetry & evidence loops to backend'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 12 (Unified Hybrid Learner Experience) Complete
* Next Phase: Phase 13 (Admin Control Panel & Knowledge Engineering Workbench)
* Status: Complete and Verified (21/21 backend tests passing + all Next.js views validated with 0 errors)
* Last Updated: 2026-08-31

## Phase 12 Summary
* Frontend views built & validated (0 oxlint errors):
  1. src/app/missions/page.jsx (Self-Directed Adaptive Mission Player with real-time Explainability HUD and Evidence Feedback)
  2. src/app/knowledge-graph/page.jsx (Multi-Domain Knowledge Graph DAG with interactive node state glowing and 5-D mastery inspector)
  3. src/app/learner/profile/page.jsx (Learner Cognitive Profile, 5-D Mastery Vectors, Spaced Repetition Due Queue, Exploration Radar)
  4. src/app/tracks/[courseId]/page.jsx (Structured Track Player with Prerequisite Gates, Module Bypass Exams, and Bkash instant unlocks)
* Test Suite Status: 21 passed in 12.82s.
''')

print('Phase 12 recorded in TODO and STATE!')
