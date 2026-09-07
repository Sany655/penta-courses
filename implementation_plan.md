# Fix: Header Overlap + Outdated Navigation Links

## Two Problems

### 1. Double Header (Overlap)
The root [layout.jsx](file:///c:/All/works/penta-course/src/app/layout.jsx) renders a global `<NavigationBar />` (fixed, `z-40`, `h-16`). But **12 pages** each render their **own inline `<nav>`** (sticky, `z-50`) with a "PentaCourse" bar, causing two stacked headers and content hidden behind them.

### 2. Outdated NavigationBar Links
The global [NavigationBar.jsx](file:///c:/All/works/penta-course/src/components/NavigationBar.jsx) has **old anchor links** that don't match the actual pages:

| Current Link | Points To | Problem |
|---|---|---|
| Curriculum Tracks | `/#courses` | No `#courses` anchor exists on homepage |
| FAQ | `/#faq` | No `#faq` anchor exists on homepage |
| Custom Tracks | `/#contact` | No `#contact` anchor exists on homepage |

**Actual pages that exist** and should be linked:

| Page | Route |
|---|---|
| Domains | `/domains` |
| Courses | `/courses` |
| How It Works | `/how-it-works` |
| Pricing | `/pricing` |
| pentabrid.com | External ✓ (already correct) |

## Proposed Changes

### 1. NavigationBar — Update Links

#### [MODIFY] [NavigationBar.jsx](file:///c:/All/works/penta-course/src/components/NavigationBar.jsx)
Update nav links (lines 55-67) to use actual routes:
```jsx
<Link href="/domains" className="nav-link">Domains</Link>
<Link href="/courses" className="nav-link">Courses</Link>
<Link href="/how-it-works" className="nav-link">How It Works</Link>
<Link href="/pricing" className="nav-link">Pricing</Link>
// pentabrid.com external link stays as-is
```

Also add a mobile hamburger menu for responsive navigation.

---

### 2. Root Layout — Add Content Spacing

#### [MODIFY] [layout.jsx](file:///c:/All/works/penta-course/src/app/layout.jsx)
- Add `pt-16` to the content wrapper `<div className="flex-1">` to push content below the fixed header
- Update footer links to match actual routes

---

### 3. Remove Duplicate Navs from All 12 Pages

For each page below, **remove** the inline `<nav>` block and the wrapping `<div className="min-h-screen ...">`:

| Page | File |
|---|---|
| Home | [page.jsx](file:///c:/All/works/penta-course/src/app/page.jsx) (also remove duplicate footer) |
| Domains | [page.jsx](file:///c:/All/works/penta-course/src/app/domains/page.jsx) |
| Courses | [page.jsx](file:///c:/All/works/penta-course/src/app/courses/page.jsx) |
| About | [page.jsx](file:///c:/All/works/penta-course/src/app/about/page.jsx) |
| Contact | [page.jsx](file:///c:/All/works/penta-course/src/app/contact/page.jsx) |
| Pricing | [page.jsx](file:///c:/All/works/penta-course/src/app/pricing/page.jsx) |
| Privacy | [page.jsx](file:///c:/All/works/penta-course/src/app/privacy/page.jsx) |
| Terms | [page.jsx](file:///c:/All/works/penta-course/src/app/terms/page.jsx) |
| Refund | [page.jsx](file:///c:/All/works/penta-course/src/app/refund/page.jsx) |
| How It Works | [page.jsx](file:///c:/All/works/penta-course/src/app/how-it-works/page.jsx) |
| Certifications | [page.jsx](file:///c:/All/works/penta-course/src/app/certifications/page.jsx) |
| Adaptive Learning | [page.jsx](file:///c:/All/works/penta-course/src/app/adaptive-learning/page.jsx) |

## Open Questions

> [!IMPORTANT]
> **Nav link selection**: I'm proposing: Domains, Courses, How It Works, Pricing, pentabrid.com. Would you prefer different links (e.g. Adaptive Engine, About, Certifications)?

> [!IMPORTANT]
> **Mobile menu**: The current NavigationBar has `hidden md:flex` for links, meaning they completely disappear on mobile with no hamburger menu. Should I add a mobile hamburger/drawer menu?

## Verification Plan
- Run `npm run dev` and visually verify on desktop and mobile viewports
- Confirm single header on all pages
- Confirm nav links navigate to correct routes

## Authentication Architecture Correction

The account system is independent of Firebase, Google authentication, and NextAuth. The FastAPI backend is the authority for users, password hashes, roles, and JWTs.

### Implemented
- Frontend login calls `/api/v1/auth/login`.
- Frontend registration calls `/api/v1/auth/register`.
- Existing sessions restore through `/api/v1/auth/me`.
- Access tokens are stored as `penta_access_token` and sent as bearer tokens.
- Logout clears the backend token from the browser.
- `SessionProvider` and active `next-auth` calls were removed from the frontend auth flow.
- Production configuration now requires `JWT_SECRET`, `SECRET_KEY`, and `DATABASE_URL`, not Firebase credentials.

### Backend Deployment Requirements
- Deploy FastAPI with the same `/api/v1` routes used by the frontend.
- Configure `DATABASE_URL` for the authoritative PostgreSQL database.
- Configure strong `JWT_SECRET` and `SECRET_KEY` values.
- Set `NEXT_PUBLIC_API_URL` in Vercel to the public FastAPI URL.

### Remaining Legacy Boundary
The admin lesson-generation/save routes under `src/app/api/admin/` still contain older NextAuth/Firebase integrations and are separate from account registration/login. They should be migrated to FastAPI admin endpoints before claiming the entire repository has zero Firebase dependencies.
