import os

with open('backend/app/services/admin_service.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_code = """        has_cycles, cycles = KnowledgeGraphService.detect_cycles(G)
        if has_cycles:
            raise ValueError(f"Adding this edge creates a cycle in the DAG: {cycles}")"""

new_code = """        is_acyclic, cycles = KnowledgeGraphService.validate_graph_acyclic(G)
        if not is_acyclic:
            raise ValueError(f"Adding this edge creates a cycle in the DAG: {cycles}")"""

code = code.replace(old_code, new_code)
with open('backend/app/services/admin_service.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated AdminService to use validate_graph_acyclic!')
