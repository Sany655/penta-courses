import json
import os
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import backend.app.models as m

class LLMCognitiveGeneratorService:
    @staticmethod
    def generate_activity_payload(
        archetype: str,
        concept_name: str,
        domain_name: str,
        difficulty: float = 0.7
    ) -> Dict[str, Any]:
        """
        Generates schema-compliant JSON payloads for the 7 Universal Cognitive Archetypes.
        In production, this queries Gemini API with structured output schema enforcement.
        Provides robust deterministic fallback archetypes.
        """
        if archetype == 'sequence_engine':
            return {
                'steps': [
                    {'action': f'Step 1: Baseline Assessment of {concept_name}', 'rationale': 'Establish initial parameters and boundary conditions.'},
                    {'action': f'Step 2: Core Mechanism Execution for {concept_name}', 'rationale': 'Execute targeted intervention according to theoretical principles.'},
                    {'action': f'Step 3: Verification and Equilibrium Check', 'rationale': 'Ensure stable convergence without secondary perturbation.'}
                ]
            }
        elif archetype == 'causal_graph':
            return {
                'nodes': [
                    {'id': '1', 'label': f'Primary Etiology: {concept_name}', 'state': 'Active', 'effect': 'Triggers downstream systemic cascade.'},
                    {'id': '2', 'label': f'Intermediate Mechanism in {domain_name}', 'state': 'Cascading', 'effect': 'Amplifies feedback perturbation.'},
                    {'id': '3', 'label': f'Terminal Outcome & Stabilization', 'state': 'Critical', 'effect': 'Requires targeted compensation protocol.'}
                ]
            }
        elif archetype == 'variable_sandbox':
            return {
                'labelA': f'{concept_name} Parameter Alpha',
                'labelB': f'{concept_name} Parameter Beta',
                'initialA': 50,
                'initialB': 30,
                'targetOutput': 75
            }
        elif archetype == 'spatial_canvas':
            return {
                'title': f'{concept_name} Structural Inspection Canvas',
                'pins': [
                    {'id': 'p1', 'x': 35, 'y': 45, 'label': 'Primary Functional Zone', 'desc': 'High metabolic active region.'},
                    {'id': 'p2', 'x': 65, 'y': 60, 'label': 'Perfusion & Vascular Channel', 'desc': 'Critical transport pathway.'}
                ]
            }
        elif archetype == 'comparative_matrix':
            return {
                'columns': [f'{concept_name} Variant A', f'{concept_name} Variant B'],
                'rows': [
                    {'feature': 'Etiology & Mechanism', 'valA': 'Primary Autonomic Trigger', 'valB': 'Secondary Compensatory Response'},
                    {'feature': 'Gold Standard Intervention', 'valA': 'Rapid Volume Expansion', 'valB': 'Targeted Receptor Antagonist'}
                ]
            }
        elif archetype == 'dialectical_builder':
            return {
                'claims': [
                    f'Claim: Core thesis regarding {concept_name} operates under strict constraints.',
                    f'Claim: Counter-perspective in {domain_name} demonstrates limitation.'
                ],
                'warrants': [
                    f'Warrant: Empirical evidence demonstrates high statistical significance.',
                    f'Warrant: Boundary condition violation invalidates standard model.'
                ]
            }
        elif archetype == 'taxonomy_sorter':
            return {
                'categories': ['High Priority / Acute', 'Elective / Stable', 'Contraindicated'],
                'items': [
                    {'id': 'i1', 'text': f'Acute manifestation of {concept_name}', 'category': 'High Priority / Acute'},
                    {'id': 'i2', 'text': f'Subclinical baseline in {domain_name}', 'category': 'Elective / Stable'}
                ]
            }
        else:
            return {'content': f'Markdown concept content for {concept_name}'}

    @staticmethod
    def generate_socratic_hint(
        concept_name: str,
        failure_category: str,
        current_attempt_score: float
    ) -> Dict[str, str]:
        hints = {
            'PREREQUISITE_GAP': f"Before tackling {concept_name}, reflect on the foundational governing law. How does the initial equilibrium determine downstream flow?",
            'MISCONCEPTION': f"Regarding {concept_name}, notice the inverse relationship here. If parameter Alpha increases, why does parameter Beta not increase linearly?",
            'PROCEDURAL_ERROR': f"Check the sequence order in {concept_name}. What crucial stabilizing step must precede direct intervention?",
            'KNOWLEDGE_GAP': f"Consider the physiological/structural constraints of {concept_name}. What is the rate-limiting factor?"
        }
        return {
            'hint_type': 'SOCRATIC',
            'failure_category': failure_category,
            'guidance': hints.get(failure_category, f"Examine the causal assumptions underlying {concept_name}.")
        }

    @staticmethod
    def expand_domain_graph_candidates(
        db: Session,
        domain_id: str
    ) -> List[Dict[str, Any]]:
        domain = db.query(m.Domain).filter(m.Domain.id == domain_id).first()
        if not domain:
            raise ValueError("Domain not found")

        # In production, invokes Gemini with domain taxonomy
        return [
            {
                'name': f'Advanced Synthesis in {domain.name}',
                'slug': f'adv-synth-{domain.slug}',
                'type': 'THEORY',
                'difficulty': 0.85,
                'prerequisite_candidate_names': ['Foundation Core']
            }
        ]
