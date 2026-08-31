import os

with open('backend/app/services/adaptive_engine.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_factors = """        factors = {
            "policy_version": policy_version,
            "weights": w,
            "feature_values": {
                "goal_relevance": round(goal_relevance, 3),
                "weakness": round(weakness, 3),
                "prereq_value": round(prereq_value, 3),
                "retention_need": round(retention_need, 3),
                "context_continuity": round(context_continuity, 3),
                "skill_importance": round(skill_importance, 3),
                "curiosity": round(curiosity, 3),
            },
            "reason_codes": reason_codes,
            "composite_score": round(total_score, 4)
        }"""

new_factors = """        feature_dict = {
            "goal_relevance": round(goal_relevance, 3),
            "weakness": round(weakness, 3),
            "prereq_value": round(prereq_value, 3),
            "retention_need": round(retention_need, 3),
            "context_continuity": round(context_continuity, 3),
            "skill_importance": round(skill_importance, 3),
            "curiosity": round(curiosity, 3),
        }
        factors = {
            "policy_version": policy_version,
            "weights": w,
            "feature_values": feature_dict,
            "reason_codes": reason_codes,
            "composite_score": round(total_score, 4),
            # Flattened for backward compatibility:
            "goal_relevance": round(goal_relevance, 3),
            "weakness": round(weakness, 3),
            "prereq_value": round(prereq_value, 3),
            "retention_need": round(retention_need, 3),
            "context_continuity": round(context_continuity, 3),
            "skill_importance": round(skill_importance, 3),
            "curiosity": round(curiosity, 3),
        }"""

code = code.replace(old_factors, new_factors)
with open('backend/app/services/adaptive_engine.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated factors backward compatibility in adaptive_engine.py!')
