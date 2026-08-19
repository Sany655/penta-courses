# ⚡ Pentabrid Engine (`penta-courses`)

> **The Next-Gen, Interactive Technical eLearning Platform & Curriculum-as-a-Service (CaaS) Engine.**  
> Dedicated to mission-critical software engineering, kernel networking, offensive cybersecurity, and clinical predictive modeling.

[![Next.js](https://img.shields.io/badge/Next.js_14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![Prisma ORM](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini AI](https://img.shields.io/badge/Gemini_AI_2.5-8E75C4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🎯 Executive Overview

Traditional video-based eLearning fails for complex, low-level technical disciplines. **Pentabrid Engine** eliminates passive video filler in favor of **active execution**: auto-typing CLI sandbox simulations, line-by-line interactive code execution steppers, visual packet-flow analyzers, and strict gatekeeper assessments with microtransaction unlocks.

Designed both as a **stand-alone learning destination** and a **white-label Marketing-as-a-Service (MaaS) EdTech platform**, Pentabrid allows developer tooling companies, enterprise security firms, and AI labs to build high-converting curriculum pipelines with embedded AI synthesis.

---

## 🏛️ The Four Core Architectural Pillars

```
                      ┌────────────────────────────────────────┐
                      │        PENTABRID ENGINE ARCHITECTURE   │
                      └──────────────────┬─────────────────────┘
                                         │
     ┌──────────────────┬────────────────┴────────────────┬──────────────────┐
     ▼                  ▼                                 ▼                  ▼
┌──────────────┐ ┌──────────────┐                 ┌──────────────┐   ┌──────────────┐
│  PILLAR 1:   │ │  PILLAR 2:   │                 │  PILLAR 3:   │   │  PILLAR 4:   │
│ High-Convert │ │ Strict RBAC  │                 │ Interactive  │   │  AI Admin    │
│ Dark-Mode    │ │ & Data       │                 │ Split-Screen │   │  Block CMS   │
│ Marketing    │ │ Isolation    │                 │ Workspace    │   │  & Staging   │
└──────────────┘ └──────────────┘                 └──────────────┘   └──────────────┘
```

### 1. 🚀 High-Converting Marketing & Landing Engine
* **Aesthetic**: Modern obsidian dark mode (`#05070a`), neon emerald spotlights, ambient matrix grids, and sub-second fluid transitions.
* **Hero Experience**: Real-time terminal typing subheadline cycling live CLI commands across all technical tracks.
* **Curriculum Catalog**: Dynamic track badges showing difficulty indices, estimated hours, lock/unlock states, and prerequisite dependency graphs.
* **Practitioner Social Proof**: Real-world validation from Senior Security Engineers, Staff ML Architects, and Infrastructure Leads.
* **Interactive Skills Telemetry**: Live graphical capability bars mapping verified mastery percentages.

---

### 2. 🛡️ Strict Role-Based Access Control (RBAC) & Data Isolation
* **Granular Roles**: Three built-in permission tiers:
  * `STUDENT`: Access to enrolled courses, interactive sandbox workspace, quiz submissions, and payment unlocks.
  * `INSTRUCTOR`: Access to course authoring tools, student progression telemetry, and module reviews.
  * `ADMIN`: Full system configuration, AI Block synthesizer access, and direct database management.
* **Route Guards & Middleware**: Edge-level JWT token verification redirecting unauthorized requests (`/admin/*` renders a custom cyber-styled 403 screen).
* **Data Isolation**: Database and API queries are strictly isolated to the authenticated user's session.

---

### 3. 💻 The Interactive Student Workspace
* **Split-Screen Layout**: Fluid, resizable dual-pane interface with draggable divider (clamped between 25% and 75%) and responsive mobile tab switching.
* **Zero-Video Interactive UI Blocks**:
  * `<MarkdownBlock/>`: Structured theoretical doctrine and mathematical principles.
  * `<AnimatedTerminal/>`: Auto-typing terminal simulator with custom prompt (`user@penta-kali:~$`), stdout streaming, copy buffer, and instant replay.
  * `<CodeStepper/>`: Step-by-step code highlighting with contextual explanatory tooltips.
  * `<NetworkFlow/>`: Animated SVG/node data-flow simulator demonstrating packet movement between kernel and userland layers.
* **Gamified Gatekeeper Progression**:
  * Lessons remain locked until the module's `<QuizGatekeeper/>` assessment is passed with at least an **80% score**.
  * **Stripe Instant Bypass Microtransaction**: Integrated modal allowing students to pay a **$2.99 fee** to bypass tests and instantly unlock advanced phases.

---

### 4. 🤖 AI-Powered Admin CMS & Staging Canvas
* **Notion-Style Block Editor**: Stackable, reorderable visual block authoring for Markdown, Terminal CLI, Code Stepper, and Network Diagrams.
* **Human-in-the-Loop Gemini LLM Synthesizer**:
  * Integrated prompt modal connected to Google's Gemini 2.5 API.
  * Enforces strict **draft-07 JSON schemas** to generate production-ready multi-block lessons.
* **Interactive Staging Canvas**: Live sandbox preview allowing instructors to test code stepping, terminal typing, and node animations before clicking **"Accept & Publish"** to commit directly to MySQL.

---

## 📚 Curriculum Tracks

| Track Category | Focus Area | Exemplar Technologies | Difficulty |
| :--- | :--- | :--- | :---: |
| **Cybersecurity** | Offensive Security & Kernel Tradecraft | Scapy Raw Sockets, EDR ETW-Ti Hooks, DKOM, C2 Tunnels | `Advanced` |
| **Predictive ML** | Clinical AI & Tabular Deep Learning | XGBoost, TreeSHAP Biomarker Attribution, Drift Tests | `Expert` |
| **Networking** | Protocol Engineering & High-Speed Filters | eBPF / XDP at 100Gbps, BGP Route Leak Guards, QUIC | `Intermediate` |
| **Web Architecture** | Distributed Systems & High Concurrency | Redis Redlock Mutex, Event-Driven CQRS, Edge SSR | `Advanced` |

---

## 🗄️ Database Architecture (`prisma/schema.prisma`)

```prisma
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

// Core Relational Models:
// - User (RBAC roles: STUDENT, INSTRUCTOR, ADMIN)
// - Course, Module, Lesson (stores typed JSON block payload)
// - Quiz (passing thresholds & explanations)
// - UserProgress (sequential unlocking & completion records)
// - Transaction (Stripe microtransactions for test bypasses)
```

---

## 🛠️ Tech Stack & Tooling

* **Frontend**: Next.js (App Router), React 19, Tailwind CSS 4, Framer Motion, Lucide Icons, Canvas Confetti.
* **Backend / API**: Node.js, Next.js Serverless Route Handlers, Zod Runtime Validation.
* **Database & ORM**: MySQL with Prisma ORM.
* **Authentication**: NextAuth / Auth.js with RBAC edge middleware.
* **AI Engine**: Google Gen AI SDK (`@google/genai` / Gemini 2.5 Flash).
* **Payment Gateway**: Stripe API (Checkout Sessions & Webhook Handlers).

---

## ⚡ Quickstart & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Sany655/penta-courses.git
cd penta-courses
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://user:password@localhost:3306/penta_courses"
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your_google_gemini_api_key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Start development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 🚀 One-Click Vercel Deployment

Deploy directly to **Vercel** with zero configuration required. The project includes [`vercel.json`](file:///c:/All/works/penta-course/vercel.json) with client-side SPA route rewrites:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sany655/penta-courses)

---

## 📄 License & Attribution

Distributed under the **MIT License**. Built with ❤️ for developers and security engineers by **Mohammad Mazharul Alam (Sany655)**.
