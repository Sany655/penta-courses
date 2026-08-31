import os

with open('backend/app/services/structured_track.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("'bypass_fee': mod.bypass_fee,", "'bypass_fee': getattr(mod, 'bypass_fee_in_cents', 299) / 100.0,")
code = code.replace("passing_threshold = module.bypass_exam_passing_score or 0.80", "passing_threshold = getattr(module, 'bypass_exam_passing_score', 0.80) or 0.80")

with open('backend/app/services/structured_track.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated structured_track.py attribute access!')
