import pytest
import uuid
import networkx as nx
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.graph_engine import KnowledgeGraphService
from backend.app.services.learner_state import LearnerStateService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_graph_construction_and_prereqs(db):
    uid = uuid.uuid4().hex[:8]
    domain = m.Domain(name=f'Graph Dom {uid}', slug=f'gdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    cA = m.Concept(domain_id=domain.id, name='Concept A', slug=f'cA-{uid}', type=m.ConceptType.FOUNDATION)
    cB = m.Concept(domain_id=domain.id, name='Concept B', slug=f'cB-{uid}', type=m.ConceptType.THEORY)
    cC = m.Concept(domain_id=domain.id, name='Concept C', slug=f'cC-{uid}', type=m.ConceptType.TECHNIQUE)
    db.add_all([cA, cB, cC])
    db.flush()

    r1 = m.ConceptRelation(from_concept_id=cA.id, to_concept_id=cB.id, relation_type=m.ConceptRelationType.REQUIRED_PREREQUISITE)
    r2 = m.ConceptRelation(from_concept_id=cB.id, to_concept_id=cC.id, relation_type=m.ConceptRelationType.REQUIRED_PREREQUISITE)
    db.add_all([r1, r2])
    db.commit()

    G = KnowledgeGraphService.build_domain_graph(db, domain.id)
    assert len(G.nodes) == 3
    assert len(G.edges) == 2

    is_acyclic, cycle = KnowledgeGraphService.validate_graph_acyclic(G)
    assert is_acyclic is True
    assert cycle is None

    prereqs_C = KnowledgeGraphService.get_prerequisites(G, cC.id, recursive=True)
    assert cA.id in prereqs_C
    assert cB.id in prereqs_C

    deps_A = KnowledgeGraphService.get_dependents(G, cA.id, recursive=True)
    assert cB.id in deps_A
    assert cC.id in deps_A

def test_learning_frontier_and_prereq_satisfaction(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'frontier_{uid}@example.com', hashed_password='fake', full_name='Frontier Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Frontier Dom {uid}', slug=f'fdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    cRoot = m.Concept(domain_id=domain.id, name='Root', slug=f'root-{uid}')
    cB1 = m.Concept(domain_id=domain.id, name='Branch 1', slug=f'b1-{uid}')
    cB2 = m.Concept(domain_id=domain.id, name='Branch 2', slug=f'b2-{uid}')
    cCap = m.Concept(domain_id=domain.id, name='Capstone', slug=f'cap-{uid}')
    db.add_all([cRoot, cB1, cB2, cCap])
    db.flush()

    db.add(m.ConceptRelation(from_concept_id=cRoot.id, to_concept_id=cB1.id, relation_type='REQUIRED_PREREQUISITE'))
    db.add(m.ConceptRelation(from_concept_id=cRoot.id, to_concept_id=cB2.id, relation_type='REQUIRED_PREREQUISITE'))
    db.add(m.ConceptRelation(from_concept_id=cB1.id, to_concept_id=cCap.id, relation_type='REQUIRED_PREREQUISITE'))
    db.add(m.ConceptRelation(from_concept_id=cB2.id, to_concept_id=cCap.id, relation_type='REQUIRED_PREREQUISITE'))
    db.commit()

    G = KnowledgeGraphService.build_domain_graph(db, domain.id)

    # Initial state: User knows nothing -> Frontier is [Root]
    frontier_initial = KnowledgeGraphService.get_learning_frontier(db, G, user.id)
    frontier_ids = [c.id for c in frontier_initial]
    assert cRoot.id in frontier_ids
    assert cB1.id not in frontier_ids
    assert cCap.id not in frontier_ids

    # Master Root via diagnostic / comprehensive mastery
    LearnerStateService.record_diagnostic_mastery(db, user.id, concept_id=cRoot.id, mastery_level=0.90)

    # Frontier now: [Branch 1, Branch 2]
    frontier_after_root = KnowledgeGraphService.get_learning_frontier(db, G, user.id)
    frontier_ids2 = [c.id for c in frontier_after_root]
    assert cB1.id in frontier_ids2
    assert cB2.id in frontier_ids2
    assert cCap.id not in frontier_ids2
    assert cRoot.id not in frontier_ids2
