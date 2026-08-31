# User Guide — Unified Hybrid Adaptive Learning Platform

## 1. Getting Started for Learners

### Dual Learning Modes
1. **Structured Guided Track (`/tracks/[courseId]`)**:
   - Ideal for structured exam prep or formal curriculum certifications.
   - Modules unlock sequentially as you achieve $\ge 70\%$ mastery in prerequisite lessons.
   - **Fast-Track Module Bypass Exam**: Already know the material? Take a 5-question bypass exam. Passing with $\ge 80\%$ unlocks the module immediately and attributes full mastery.
   - **Instant Paid Bypass**: Click "Unlock Instantly with bKash / Card" to purchase module bypass entitlements without exam constraints.

2. **Self-Directed Adaptive Mission (`/missions`)**:
   - Ideal for goal-driven, non-linear mastery and complex research.
   - Define target goals in any domain (Medicine, Law, Economics, Python Systems).
   - Real-time **Explainability HUD**: View why an activity was recommended based on your 5-D mastery, goal relevance, and retention urgency.
   - Real-time **Delta Mastery Gauge**: Watch your 5-D competency vectors increase upon successful submission.

3. **Cognitive Profile & Retention Radar (`/learner/profile`)**:
   - View your 5-D competence radar: Recall, Explanation, Application, Implementation, and Creation.
   - Check the **Ebbinghaus Spaced Review Due Queue** to prevent concept decay.
   - Explore tangent discoveries logged in your **Exploration Radar**.

4. **Interactive Knowledge Graph (`/knowledge-graph`)**:
   - Explore the topological DAG of all domains.
   - Color-coded concept nodes:
     - 🟢 **Mastered** ($\ge 70\%$)
     - 🟡 **Frontier** (Prerequisites satisfied, ready to learn)
     - 🔴 **Weak** ($< 70\%$)
     - ⚪ **Locked** (Prerequisites pending)

---

## 2. Administrator & Knowledge Engineer Workbench

### Admin Control Panel (`/admin`)
1. **Knowledge Graph Engineering**:
   - Create new knowledge domains and concept nodes.
   - Connect directed prerequisite edges with real-time **DAG Cycle Detection**. Any edge that would introduce a cycle is automatically rejected.
2. **Mastery Overrides & Audit Trail**:
   - Manually adjust learner mastery scores when required with mandatory reason logging. All overrides are permanently recorded in `admin_audit_logs`.
3. **Dynamic Pricing Control**:
   - Configure Course prices and individual Module Bypass fees in USD / BDT.
4. **AI Cognitive Activity Authoring**:
   - Utilize the LLM Cognitive Activity Generator to produce structured interactive exercises across all 7 archetypes.
