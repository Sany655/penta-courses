import os

with open('docs/IMPLEMENTATION_TODO.md', 'r', encoding='utf-8') as f:
    todo_text = f.read()

todo_text = todo_text.replace(
'''## Phase 7 — Multi-Domain Knowledge Graphs & Seed Expansions
- [ ] Implement multi-domain knowledge graph schema seeding
- [ ] Seed Clinical Medicine & Differential Pathophysiology graph & activities
- [ ] Seed Constitutional Law & Jurisprudential Logic graph & activities
- [ ] Seed Macroeconomics & Quantitative Finance graph & activities
- [ ] Seed Python Systems & High Concurrency graph & activities
- [ ] Verify multi-domain graph validation tests''',
'''## Phase 7 — Multi-Domain Knowledge Graphs & Seed Expansions
- [x] Implement multi-domain knowledge graph schema seeding
- [x] Seed Clinical Medicine & Differential Pathophysiology graph & activities
- [x] Seed Constitutional Law & Jurisprudential Logic graph & activities
- [x] Seed Macroeconomics & Quantitative Finance graph & activities
- [x] Seed Python Systems & High Concurrency graph & activities
- [x] Verify multi-domain graph validation tests'''
)

with open('docs/IMPLEMENTATION_TODO.md', 'w', encoding='utf-8') as f:
    f.write(todo_text)

with open('docs/IMPLEMENTATION_STATE.md', 'w', encoding='utf-8') as f:
    f.write('''# Implementation State Record

## Current Status
* Current Phase: Phase 7 (Multi-Domain Knowledge Graphs & Seed Expansions) Complete
* Next Phase: Phase 8 (Goal Engine, Diagnostic Probes & Gap Analysis)
* Status: Complete and Verified (17/17 backend tests + 4 seeded domains active)
* Last Updated: 2026-08-31

## Phase 7 Summary
* 4 Multi-Domain Knowledge Graphs Seeded:
  1. Clinical Medicine & Differential Pathophysiology (ABG, Anion Gap, HAGMA, DKA Pathogenesis, Acute Resuscitation)
  2. Constitutional Law & Jurisprudential Logic (Judicial Review, Equal Protection, Strict Scrutiny Dialectical Analysis)
  3. Macroeconomics & Quantitative Finance (Central Bank Rates, Yield Curve Dynamics, Multi-Variable Simulation)
  4. Python Systems & High Concurrency Architecture (CPython GIL, AsyncIO Event Loops, Distributed Redlock Consensus)
* Activity instances mapped to Cognitive Block Archetypes across all 4 domains.

## Test Suite Status
* 17 passed in 14.15s
''')

print('Phase 7 recorded in TODO and STATE!')
