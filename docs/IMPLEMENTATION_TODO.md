# Implementation TODO List

## Phase 0 — Repository Audit
- [x] Inspect existing frontend architecture (Next.js 16, React 19, TailwindCSS 4, Framer Motion)
- [x] Inspect existing backend & API routes (App router API handlers, Firebase Auth / NextAuth)
- [x] Inspect database & storage (courses.json, courses.db SQLite)
- [x] Inspect interactive blocks (Markdown, CodeStepper, AnimatedTerminal, NetworkFlow, QuizGatekeeper)
- [x] Inspect payment system (BkashPaymentModal, Stripe integration patterns)
- [x] Inspect AI integration (@google/genai lesson generator)
- [x] Initialize Architecture Decisions Record (docs/ARCHITECTURE_DECISIONS.md)
- [x] Initialize Implementation State (docs/IMPLEMENTATION_STATE.md)
- [x] Complete Phase 0 Audit Report

## Phase 1 — Core Data Model & Relational Backend
- [x] Set up backend directory structure (FastAPI, SQLAlchemy, Alembic, Pydantic v2)
- [x] Implement Knowledge Graph models (Domain, Concept, Skill, ConceptRelation, SkillRelation, ConceptSkill, Resource, ResourceConcept)
- [x] Implement Learner models (LearnerProfile, LearnerDomainState, LearnerConceptState, LearnerSkillState, Goal)
- [x] Implement Session & Evidence models (LearningSession, Activity, Attempt, LearningEvidence, FailureEvent, LearningEvent, ExplorationItem)
- [x] Implement Course ↔ Graph mapping models (Course, Module, Lesson, CourseDomainMap, LessonConceptMap)
- [x] Implement Commerce & Admin models (Product, Transaction, Entitlement, ModuleBypass, Certificate, AdminAuditLog)
- [x] Implement User, DeviceSession & Role Auth models (STUDENT, INSTRUCTOR, CONTENT_ADMIN, AI_ADMIN, COMMERCE_ADMIN, SUPER_ADMIN)
- [x] Create database initialization and migration scripts (PostgreSQL / SQLite support)
- [x] Create multi-domain seed data (Medicine, Law, Python, Economics)
- [x] Implement basic CRUD & Graph REST endpoints

## Phase 2 — Learner State Engine
- [x] Implement Evidence recording service
- [x] Implement Multidimensional mastery calculation vector
- [x] Implement Confidence scoring & Unknown vs Weak state distinction
- [x] Implement Ebbinghaus retention decay & review_due calculation
- [x] Implement Domain level (L0-L6) & skill state progression
- [x] Unit tests for Learner State Engine

## Phase 3 — Knowledge Graph Engine
- [ ] Implement Graph traversal & prerequisite validation
- [ ] Implement Dependency analysis & topological sort
- [ ] Implement Candidate generation filtering
- [ ] Implement Course ↔ Graph mapping validation
- [ ] Unit tests for Graph Engine

## Phase 4 — Adaptive Decision Engine
- [x] Implement Candidate Scoring algorithm with configurable weights
- [x] Implement Action Selection Matrix (LEARN, EXPLAIN, PRACTICE, IMPLEMENT, BUILD, REVIEW, ADVANCE)
- [x] Implement Adaptive Difficulty Balancer (65-80% target)
- [x] Implement Failure Diagnosis Classifier (10 Categories)
- [x] Implement Prerequisite Repair Loop
- [x] Implement Structured Explainable Recommendation Generator
- [x] Comprehensive unit tests for Adaptive Engine

## Phase 5 — Learning Session Engine
- [ ] Implement Learning Session lifecycle API
- [ ] Implement Activity delivery & telemetry collector
- [ ] Implement Attempt evaluation & rubric validator
- [ ] Implement Closed adaptive loop orchestration
- [ ] Integration tests for full Session loop

## Phase 6 — Interactive Block Adaptation & Universal Renderers
- [ ] Adapt existing blocks (Markdown, CodeStepper, Terminal, NetworkFlow, Quiz) to emit evidence
- [ ] Implement 7 Universal Cognitive Block Renderers:
  - [ ] SequenceEngine
  - [ ] CausalSystemGraph
  - [ ] VariableSandbox
  - [ ] SpatialCanvas
  - [ ] ComparativeMatrix
  - [ ] DialecticalBuilder
  - [ ] TaxonomySorter
- [ ] Build Cognitive Block Registry in frontend

## Phase 7 — AI Cognitive Layer
- [ ] Implement LLM Provider abstraction (Gemini, OpenAI, Anthropic, Local)
- [ ] Implement Pydantic output validation schemas
- [ ] Implement Concept Explainer & Socratic Questioning service
- [ ] Implement Dynamic Exercise & Rubric generator
- [ ] Implement AI Domain Ingestion Pipeline with confidence tags
- [ ] Implement AI Audit Logging

## Phase 8 — Guided Track Integration (Mode A)
- [ ] Integrate adaptive overlays into Course / Module / Lesson views
- [ ] Implement Diagnostic test-out capability in courses
- [ ] Implement Prerequisite repair injection in course modules
- [ ] Implement Real-time concept mastery badges

## Phase 9 — Self-Directed Adaptive Mission (Mode B)
- [ ] Implement Goal creation & Domain graph ingestion UI
- [ ] Implement Diagnostic Assessment flow
- [ ] Implement Mission-First Dashboard (What should I do right now? Why?)
- [ ] Implement Curiosity & Exploration system

## Phase 10 — Admin Control Panel
- [ ] Implement Knowledge Graph Visual Studio (Node & Edge editor)
- [ ] Implement Course ↔ Graph Mapper CMS
- [ ] Implement AI Ingestion Review Queue
- [ ] Implement Learner State & Diagnostic Override Tools

## Phase 11 — Commerce & Monetization Engine
- [ ] Implement Stripe & bKash payment gateway service
- [ ] Implement Module Bypass entitlement processor
- [ ] Implement Idempotent webhook handling & transaction ledger
- [ ] Implement Deterministic Certification exam eligibility

## Phase 12 — Web UI Polish & Next.js Integration
- [ ] Unify Next.js App Router with FastAPI backend
- [ ] Knowledge Graph Interactive Visualizer (cytoscape / react-flow / d3)
- [ ] Project-Based Learning Hub
- [ ] Profile, Analytics & Retention calendar

## Phase 13 — Offline Core (SQLite & Outbox)
- [ ] Implement client-side SQLite schema & local projections
- [ ] Implement Offline Outbox queue for attempts and evidence
- [ ] Implement Local lightweight adaptive decision fallback

## Phase 14 — Synchronization Engine
- [ ] Implement Event-sourced push/pull protocol
- [ ] Implement Device Identity & Sync cursor tracking
- [ ] Implement Deterministic conflict resolution rules
- [ ] Multi-device sync tests

## Phase 15 — Windows Desktop (Tauri)
- [ ] Configure Tauri packaging for Next.js frontend
- [ ] Integrate local SQLite & offline sync worker

## Phase 16 — Android Mobile Client (Flutter)
- [ ] Configure Flutter client connecting to shared API contract
- [ ] Implement offline caching & background sync

## Phase 17 — Security, Hardening & End-to-End QA
- [ ] End-to-End Acceptance Tests (Goal -> Diagnostic -> Mission -> Attempt -> Evidence -> Mastery -> Repair -> Advance)
- [ ] Security audit (RBAC, Rate limiting, PII privacy, Secret management)

## Phase 18 — Production Deployment & Docker
- [ ] Docker Compose setup (FastAPI, PostgreSQL, Redis, Next.js)
- [ ] Production documentation & deployment runbooks
