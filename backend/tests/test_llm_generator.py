import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.llm_generator import LLMCognitiveGeneratorService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_llm_cognitive_generator_all_7_archetypes(db):
    archetypes = [
        'sequence_engine',
        'causal_graph',
        'variable_sandbox',
        'spatial_canvas',
        'comparative_matrix',
        'dialectical_builder',
        'taxonomy_sorter'
    ]

    for arch in archetypes:
        payload = LLMCognitiveGeneratorService.generate_activity_payload(
            archetype=arch,
            concept_name='Test Concept',
            domain_name='Test Domain'
        )
        assert isinstance(payload, dict)
        assert len(payload) > 0

    # Test Socratic Hint
    hint = LLMCognitiveGeneratorService.generate_socratic_hint(
        concept_name='DKA Pathogenesis',
        failure_category='MISCONCEPTION',
        current_attempt_score=0.4
    )
    assert hint['hint_type'] == 'SOCRATIC'
    assert 'DKA Pathogenesis' in hint['guidance']

    # Test Domain Expansion
    uid = uuid.uuid4().hex[:6]
    dom = m.Domain(name=f'Synthetic Biology {uid}', slug=f'synbio-{uid}', status='PUBLISHED')
    db.add(dom)
    db.commit()

    candidates = LLMCognitiveGeneratorService.expand_domain_graph_candidates(db, dom.id)
    assert len(candidates) >= 1
