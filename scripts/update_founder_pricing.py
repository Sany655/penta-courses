import os

with open('backend/app/services/commerce_service.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_catalog = """    @staticmethod
    def get_product_catalog(db: Session, currency: str = "USD") -> List[Dict[str, Any]]:
        \"\"\"
        Returns the active production product catalog with pricing and entitlements.
        \"\"\"
        courses = db.query(m.Course).filter(m.Course.is_published == True).all()
        products = []

        # 1. Free Tier
        products.append({
            "product_id": "tier-free-adaptive",
            "name": "Free Adaptive Learning",
            "type": "FREE_TIER",
            "price": 0.0,
            "currency": currency,
            "description": "Full access to diagnostic probes, foundational knowledge graphs, and basic adaptive missions.",
            "entitlements": ["FREE_ADAPTIVE_MISSION", "DIAGNOSTIC_PROBES"]
        })

        # 2. Premium Adaptive Mission Subscription"""

new_catalog = """    @staticmethod
    def get_product_catalog(db: Session, currency: str = "USD") -> List[Dict[str, Any]]:
        \"\"\"
        Returns the active production product catalog with pricing and entitlements.
        \"\"\"
        courses = db.query(m.Course).filter(m.Course.is_published == True).all()
        products = []

        # 1. Free Diagnostic & Adaptive Tier
        products.append({
            "product_id": "tier-free-diagnostic",
            "name": "Free 3-Minute Diagnostic Probe",
            "type": "FREE_TIER",
            "price": 0.0,
            "currency": currency,
            "description": "Immediate 5-D competence radar, knowledge gap analysis, and interactive DAG exploration with genuine pedagogical feedback.",
            "entitlements": ["FREE_ADAPTIVE_MISSION", "DIAGNOSTIC_PROBES", "COMPETENCE_RADAR"]
        })

        # 2. Early-Bird Founder Track (Limited to First 100 Cohort Members)
        founder_price = 29.0 if currency == "USD" else 3300.0
        products.append({
            "product_id": "founder-course-track",
            "name": "Founder Cohort Track Pass",
            "type": "FOUNDER_TRACK",
            "price": founder_price,
            "currency": currency,
            "max_slots": 100,
            "is_founder_offer": True,
            "description": "Full lifetime access to any chosen single Course Track, including Module Bypass Exams and verified graduation certification.",
            "entitlements": ["FOUNDER_COURSE_TRACK", "MODULE_BYPASS_EXAMS", "COURSE_CERTIFICATION"]
        })

        # 3. Premium Adaptive Mission Subscription"""

code = code.replace(old_catalog, new_catalog)

with open('backend/app/services/commerce_service.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated commerce_service.py with Founder Track pricing!')
