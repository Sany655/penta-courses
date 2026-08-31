# Architecture Decision Record (ADR)

## ADR-001: Unified Learning Engine with Dual Pedagogical Experiences
* **Date**: 2026-08-31
* **Status**: Accepted
* **Context**: The platform previously had a static interactive LMS model (penta-course). The specification calls for an autonomous graph-driven adaptive cognitive OS.
* **Decision**: Merge both into a Unified Hybrid Platform. Both Mode A (Structured Guided Track) and Mode B (Self-Directed Adaptive Mission) share the same underlying knowledge graph, learner state, evidence system, and adaptive decision engine.
* **Alternatives Rejected**: Building two separate parallel learning engines.

## ADR-002: Modular Backend Architecture in Python FastAPI with PostgreSQL / SQLite Support
* **Date**: 2026-08-31
* **Status**: Accepted
* **Context**: Need high-performance, deterministic adaptive computation, scientific graph traversal, robust typing with Pydantic v2, and clean REST APIs consumable across Web (Next.js), Windows Desktop (Tauri), and Android (Flutter).
* **Decision**: Implement the backend engine in Python FastAPI + SQLAlchemy + Pydantic v2 + Alembic, with PostgreSQL for server-authoritative state and SQLite support for offline clients.
* **Alternatives Rejected**: Implementing entire adaptive engine within Next.js serverless route handlers.

## ADR-003: 7 Universal Multi-Domain Cognitive Interactive Block Archetypes
* **Date**: 2026-08-31
* **Status**: Accepted
* **Context**: Existing interactive blocks were limited to specific tech concepts (code steppers, terminals, network diagrams). Platform needs exponential multi-domain scale (Medicine, Law, Economics, Linguistics, Engineering, Physics).
* **Decision**: Create 7 abstract cognitive primitives:
  1. SequenceEngine (Step-through processes)
  2. CausalSystemGraph (Dependency & causality explorer)
  3. VariableSandbox (Parametric simulation lab)
  4. SpatialCanvas (Hotspot & schematic explorer)
  5. ComparativeMatrix (Differential matrix & semantic diffs)
  6. DialecticalBuilder (Structured argument & thesis defense)
  7. TaxonomySorter (Triage & classification sorter)
  All blocks emit standardized evidence telemetry to the adaptive engine.
* **Alternatives Rejected**: Creating domain-specific hardcoded widgets for every individual discipline.

## ADR-004: Non-Authoritative AI Boundary
* **Date**: 2026-08-31
* **Status**: Accepted
* **Context**: LLMs can hallucinate and are non-deterministic.
* **Decision**: AI provides cognitive assistance (explanations, dynamic exercise generation, rubric scoring, domain ingestion) validated strictly through Pydantic schemas. The AI never directly mutates mastery state or determines progression. All state transitions are deterministic.
* **Alternatives Rejected**: Letting LLM directly output mastery scores or progression flags.

## ADR-005: Event-Sourced Offline Synchronization
* **Date**: 2026-08-31
* **Status**: Accepted
* **Context**: Desktop (Tauri) and Mobile (Flutter) clients need offline learning capabilities.
* **Decision**: Client stores mutations in a local SQLite outbox as immutable LearningEvent items. Server performs cursor-based sync with deterministic conflict resolution.
