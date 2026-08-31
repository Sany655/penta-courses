import networkx as nx
from typing import List, Dict, Tuple, Optional, Set
from sqlalchemy.orm import Session
import backend.app.models as m

class KnowledgeGraphService:
    @staticmethod
    def build_domain_graph(db: Session, domain_id: str) -> nx.DiGraph:
        # Build networkx DiGraph where edge (u, v) means concept u is a prerequisite for concept v
        G = nx.DiGraph()
        
        concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain_id).all()
        for c in concepts:
            G.add_node(
                c.id,
                name=c.name,
                slug=c.slug,
                difficulty=c.difficulty,
                importance=c.importance,
                type=c.type
            )
        
        concept_ids = [c.id for c in concepts]
        if concept_ids:
            relations = db.query(m.ConceptRelation).filter(
                m.ConceptRelation.from_concept_id.in_(concept_ids),
                m.ConceptRelation.to_concept_id.in_(concept_ids)
            ).all()
            for r in relations:
                G.add_edge(
                    r.from_concept_id,
                    r.to_concept_id,
                    relation_type=r.relation_type,
                    strength=r.strength,
                    confidence=r.confidence
                )
        return G

    @staticmethod
    def validate_graph_acyclic(G: nx.DiGraph) -> Tuple[bool, Optional[List[str]]]:
        # Check if graph has circular dependencies
        try:
            cycles = list(nx.simple_cycles(G))
            if cycles:
                return False, cycles[0]
            return True, None
        except Exception:
            return True, None

    @staticmethod
    def get_prerequisites(G: nx.DiGraph, concept_id: str, recursive: bool = True) -> Set[str]:
        # Return all ancestor concept IDs that are prerequisites for concept_id
        if concept_id not in G:
            return set()
        if not recursive:
            return set(G.predecessors(concept_id))
        return nx.ancestors(G, concept_id)

    @staticmethod
    def get_dependents(G: nx.DiGraph, concept_id: str, recursive: bool = True) -> Set[str]:
        # Return all descendant concept IDs enabled by concept_id
        if concept_id not in G:
            return set()
        if not recursive:
            return set(G.successors(concept_id))
        return nx.descendants(G, concept_id)

    @staticmethod
    def check_prerequisites_satisfied(
        db: Session,
        G: nx.DiGraph,
        user_id: str,
        concept_id: str,
        threshold: float = 0.70
    ) -> Tuple[bool, List[m.Concept], List[m.Concept]]:
        # Check if all REQUIRED_PREREQUISITE concepts for concept_id are mastered (>= threshold)
        if concept_id not in G:
            return True, [], []

        required_prereq_ids = []
        for pred_id in G.predecessors(concept_id):
            edge_data = G.get_edge_data(pred_id, concept_id)
            if edge_data and edge_data.get('relation_type') in [
                m.ConceptRelationType.REQUIRED_PREREQUISITE,
                'REQUIRED_PREREQUISITE'
            ]:
                required_prereq_ids.append(pred_id)

        if not required_prereq_ids:
            return True, [], []

        prereq_concepts = db.query(m.Concept).filter(m.Concept.id.in_(required_prereq_ids)).all()
        prereq_states = db.query(m.LearnerConceptState).filter(
            m.LearnerConceptState.user_id == user_id,
            m.LearnerConceptState.concept_id.in_(required_prereq_ids)
        ).all()

        state_by_concept = {s.concept_id: s for s in prereq_states}
        
        satisfied = []
        missing = []

        for c in prereq_concepts:
            s = state_by_concept.get(c.id)
            if s and s.mastery is not None and s.mastery >= threshold:
                satisfied.append(c)
            else:
                missing.append(c)

        is_satisfied = (len(missing) == 0)
        return is_satisfied, satisfied, missing

    @staticmethod
    def get_learning_frontier(
        db: Session,
        G: nx.DiGraph,
        user_id: str,
        mastery_threshold: float = 0.70
    ) -> List[m.Concept]:
        # Identify learning frontier concepts: Not yet mastered, but all required prerequisites are satisfied
        all_concept_ids = list(G.nodes)
        if not all_concept_ids:
            return []

        concepts = db.query(m.Concept).filter(m.Concept.id.in_(all_concept_ids)).all()
        concept_states = db.query(m.LearnerConceptState).filter(
            m.LearnerConceptState.user_id == user_id,
            m.LearnerConceptState.concept_id.in_(all_concept_ids)
        ).all()

        state_map = {s.concept_id: s for s in concept_states}
        frontier = []

        for c in concepts:
            s = state_map.get(c.id)
            is_mastered = (s is not None and s.mastery is not None and s.mastery >= mastery_threshold)
            if is_mastered:
                continue

            satisfied, _, missing = KnowledgeGraphService.check_prerequisites_satisfied(
                db, G, user_id, c.id, threshold=mastery_threshold
            )
            if satisfied:
                frontier.append(c)

        return frontier
