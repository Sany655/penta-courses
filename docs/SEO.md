# Production SEO Architecture & Strategy Guide

## 1. Technical SEO Architecture

The platform uses server-rendered Next.js pages with dynamic XML sitemaps and standards-compliant metadata:

- **Robots Directives** (`/robots.txt`):
  - Indexable public routes: `/`, `/learn`, `/courses`, `/domains`, `/adaptive-learning`, `/how-it-works`, `/pricing`, `/certifications`, `/certificates/`, `/about`, `/terms`, `/privacy`, `/refund`, `/contact`.
  - Non-indexable private routes: `/dashboard`, `/learner/`, `/admin/`, `/missions/private`, `/account`, `/checkout`, `/api/`.
- **Dynamic XML Sitemap** (`/sitemap.xml`): Automatically informs search engines of route changes and priorities.
- **Canonical URLs & Open Graph Tags**: Set on all public pages.

---

## 2. Structured Data (JSON-LD)

Public landing pages expose JSON-LD microdata schemas:
1. `Organization`: PentaCourse branding, domain, logo, and contact info.
2. `WebSite`: SearchAction and site navigation.
3. `Course`: Schema markup for structured course tracks and prerequisite mappings.
4. `FAQPage`: Schema markup for pricing, module bypass, and adaptive learning FAQs.

---

## 3. Organic Discovery Funnel

```
Search Engine Discovery (Google / Bing)
      │
      ▼
Domain / Course Public Landing Page (/domains, /courses)
      │
      ▼
Free Diagnostic Probe / Graph Exploration (/missions)
      │
      ▼
Adaptive Recommendation Demonstration
      │
      ▼
Conversion to Pro / Track Purchase (/pricing, /checkout)
```
