import os

with open('backend/app/services/llm_generator.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_hints = """        hints = {
            'PREREQUISITE_GAP': f"Before tackling {concept_name}, reflect on the foundational governing law. How does the initial equilibrium determine downstream flow?",
            'MISCONCEPTION': f"Notice the inverse relationship here. If parameter Alpha increases, why does parameter Beta not increase linearly?",
            'PROCEDURAL_ERROR': f"Check the sequence order. What crucial stabilizing step must precede direct intervention?",
            'KNOWLEDGE_GAP': f"Consider the physiological/structural constraints of {concept_name}. What is the rate-limiting factor?"
        }"""

new_hints = """        hints = {
            'PREREQUISITE_GAP': f"Before tackling {concept_name}, reflect on the foundational governing law. How does the initial equilibrium determine downstream flow?",
            'MISCONCEPTION': f"Regarding {concept_name}, notice the inverse relationship here. If parameter Alpha increases, why does parameter Beta not increase linearly?",
            'PROCEDURAL_ERROR': f"Check the sequence order in {concept_name}. What crucial stabilizing step must precede direct intervention?",
            'KNOWLEDGE_GAP': f"Consider the physiological/structural constraints of {concept_name}. What is the rate-limiting factor?"
        }"""

code = code.replace(old_hints, new_hints)
with open('backend/app/services/llm_generator.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated Socratic hint templates!')
