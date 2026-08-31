import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 6 — Interactive Block Adaptation
- [ ] Implement Multi-Domain Cognitive Block Renderer Architecture
- [ ] Refactor and adapt existing tech renderers into Cognitive Archetypes
- [ ] Implement Causal System Graph Renderer
- [ ] Implement Sequence & State Transition Engine Renderer
- [ ] Implement Variable Parameter Sandbox Renderer
- [ ] Implement Spatial & Anatomical Canvas Renderer
- [ ] Implement Comparative / Differential Matrix Renderer
- [ ] Implement Dialectical & Socratic Builder Renderer
- [ ] Implement Taxonomy & Timeline Classifier Renderer
- [ ] Add unified block telemetry & evidence emission''',
'''## Phase 6 — Interactive Block Adaptation
- [x] Implement Multi-Domain Cognitive Block Renderer Architecture
- [x] Refactor and adapt existing tech renderers into Cognitive Archetypes
- [x] Implement Causal System Graph Renderer
- [x] Implement Sequence & State Transition Engine Renderer
- [x] Implement Variable Parameter Sandbox Renderer
- [x] Implement Spatial & Anatomical Canvas Renderer
- [x] Implement Comparative / Differential Matrix Renderer
- [x] Implement Dialectical & Socratic Builder Renderer
- [x] Implement Taxonomy & Timeline Classifier Renderer
- [x] Add unified block telemetry & evidence emission'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 6 (Interactive Block Adaptation & 7 Universal Cognitive Renderers) Complete
* Next Phase: Phase 7 (Multi-Domain Knowledge Graphs & Seed Expansions)
* Status: Complete and Verified (17/17 backend tests + 8 frontend components validated)
* Last Updated: 2026-08-31

## Phase 6 Summary
* 7 Universal Cognitive Block Renderers created in src/components/cognitive/:
  1. SequenceEngine.jsx (Step-through execution & state transition engine)
  2. CausalSystemGraph.jsx (Interactive causal nodes & cascade perturbation)
  3. VariableSandbox.jsx (Multi-variable parameter tuning simulation)
  4. SpatialCanvas.jsx (Hotspot diagnostic & anatomical pin inspection)
  5. ComparativeMatrix.jsx (Differential matrix & trade-off analyzer)
  6. DialecticalBuilder.jsx (Thesis, warrant, and argument linkage builder)
  7. TaxonomySorter.jsx (Categorical & emergency triage classifier)
* CognitiveBlockRegistry.jsx and InteractiveBlock dispatcher created in src/components/student/BlockRenderers.jsx with 100% backward compatibility and evidence emission.

## Test Suite Status
* 17 passed in 24.22s
''')

print('Phase 6 recorded in TODO and STATE!')
