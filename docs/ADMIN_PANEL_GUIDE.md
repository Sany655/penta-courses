# Pentabrid Cyber Security & Universal LMS — Complete Administrator Operations Manual
*Version 2.5 — Gemini Flash Cognitive Architecture & Administrative Handbook*

---

## 1. System Architecture & Access Overview

Pentabrid is an enterprise-grade learning platform built on Next.js 16 (Turbopack frontend), FastAPI (Python 3.11 backend), and dual-tier database support (local SQLite development / Neon PostgreSQL in production). It features role-based access control (RBAC), brute-force defense, and direct integration with Google Gemini 2.5 Flash for cognitive curriculum synthesis.

### 1.1 Administrator Roles & Permissions
Only users with the `ADMIN` role can access administrative endpoints and the administrative interface (`/admin`).

| Feature Area | Regular User (`STUDENT`) | Administrator (`ADMIN`) |
| :--- | :---: | :---: |
| Browse Course Catalog | Yes | Yes |
| Interactive Lessons & Labs | Yes | Yes |
| Submit Inquiries / Helpdesk | Yes | Yes |
| Purchase Courses (bKash) | Yes | Yes |
| Verify Manual bKash TrxID | No | **Full Access** |
| Access Admin Dashboard (`/admin`) | No (403 Forbidden) | **Full Access** |
| Gemini 2.5 AI Lesson Builder | No (403 Forbidden) | **Full Access** |
| Universal Syllabus & PDF Ingest | No (403 Forbidden) | **Full Access** |
| Student Inquiry Resolution | No (403 Forbidden) | **Full Access** |
| Administrative Password Reset | Self via Auth Form | Self + Admin Console |

---

## 2. Authentication, Login & Security

### 2.1 Default Administrative Credentials
- **Admin Email**: `admin@pentabrid.com`
- **Default Password**: Set via `.env` or during system setup.

### 2.2 Logging In to the System
1. Navigate to the login portal: `https://<your-domain>/auth` or `http://localhost:3000/auth`.
2. Enter `admin@pentabrid.com` and your administrative password.
3. Click **Sign In**.
4. Once authenticated, click the **Admin HUD** link in the navigation header or directly visit `/admin`.

### 2.3 Brute-Force & Lockout Safeguards
The platform enforces three defensive layers against unauthorized access:
1. **Frontend Honeypot (`website_url_hp`)**: Hidden field that traps automated bots. Submitting this field immediately drops the request with a silent rejection.
2. **Backend In-Memory Rate Limiting**: Maximum **5 login attempts per 60 seconds per IP**. Exceeding this returns HTTP 429 (`Too Many Requests`).
3. **Database Account Lockout**: After **5 consecutive failed password attempts**, the account is locked in the database for **15 minutes**.
4. **Cloudflare Turnstile Ready**: Toggle `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` in `.env` to enable invisible bot challenges without breaking developer workflows.

### 2.4 Password Reset (Two Methods)

#### Method A: Self-Service via Email Reset Link
1. On the `/auth` page, click **"Forgot your password?"**.
2. Enter your email (`admin@pentabrid.com`) and click **"Send Recovery Link"**.
3. Check your mailbox for an email containing a secure 15-minute token link: `https://<domain>/auth?token=<secure_token>`.
4. Click the link and enter your new password.

#### Method B: In-HUD Password Reset
1. While logged in as Admin, navigate to `/admin`.
2. Scroll to the **"Security & Account Settings"** section.
3. Enter your current password and your new password.
4. Click **Update Password**.

---

## 3. The Interactive Lesson Builder Studio

The Lesson Builder is located at `/admin` under the **"AI Lesson Studio"** tab (or directly rendered within the Admin HUD). It allows authoring rich, interactive multi-block lessons that go far beyond flat markdown.

### 3.1 Supported Interactive Block Types
Each lesson consists of structured, re-orderable blocks:

| Block Type | Description | Best Used For |
| :--- | :--- | :--- |
| **`markdown`** | Rich formatting, code snippets, LaTeX formulas, quotes, and callouts. | Conceptual explanations, mathematical proofs, background theory. |
| **`terminal_animation`**| Interactive terminal typing out shell commands with real-time simulated outputs. | CLI tools, network utilities (`ping`, `nmap`), scripts, package managers. |
| **`code_stepper`** | Multi-step annotated code walkthrough where lines highlight sequentially with explanatory tooltips. | Explaining algorithms, kernel hooks, Python/C++ code, API requests. |
| **`network_diagram`**| Visual node-based topology flow showing animated data packet paths between nodes. | Client-Server models, TCP handshakes, DDoS attacks, routing. |

### 3.2 Manual Lesson Authoring (Step-by-Step)
1. **Target Assignment**:
   - In the **Course** dropdown, select the parent course (e.g. *Computer Science & ICT Fundamentals*).
   - In the **Module** dropdown, select the target unit (e.g. *Unit-1: Introduction to ICT*).
   - Enter a descriptive **Lesson Title** (e.g. *Understanding the Information Processing Cycle*).
   - Select difficulty: `Beginner`, `Intermediate`, or `Advanced`.
2. **Adding Blocks**:
   - Click **`+ Add Markdown Block`** to insert explanatory text.
   - Click **`+ Add Terminal Animation`** to demonstrate a shell command. Configure the command (e.g. `uname -a`) and expected output.
   - Click **`+ Add Code Stepper`** to create an interactive code tour.
   - Click **`+ Add Network Diagram`** to visualize data flow between clients, servers, and firewalls.
3. **Reordering & Deleting**:
   - Use the **Up (`↑`)** and **Down (`↓`)** arrows on any block to change its sequence.
   - Click the **Trash (`🗑`)** icon to remove unwanted blocks.
4. **Staging Preview**:
   - Click the **"Live Preview"** button at the top right to verify how students will see the lesson in the student viewer.
5. **Publish to Database**:
   - Click **"Save & Publish Lesson"**.
   - A green toast will confirm the lesson has been committed to the database.

---

## 4. AI-Powered Single Lesson Generation (Gemini 2.5 Flash)

Instead of hand-crafting every block, you can prompt Google Gemini 2.5 Flash to automatically compose an end-to-end interactive lesson.

### Step-by-Step AI Lesson Generation:
1. In the Lesson Builder HUD, click the **"Generate with Gemini AI"** button (cyan sparkle icon).
2. A prompt modal appears. Type a focused topic, for example:
   > *"Unit-2: Categories of Computer Hardware — Input devices, Output devices, The System Unit, and CPU ALU/Control Unit operations with interactive memory bus diagram and code stepper."*
3. Click **"Generate & Stage Blocks"**.
4. Gemini 2.5 Flash will synthesize:
   - Theoretical markdown background with clear formatting.
   - An interactive terminal demonstration showing system hardware queries (e.g. `lscpu`, `lsblk`).
   - A code stepper walking through hardware control logic.
   - A network/architecture diagram illustrating the CPU-RAM-Storage bus.
5. The generated blocks will immediately populate your builder canvas.
6. Review the blocks, edit any text or parameters if needed, and click **"Save & Publish Lesson"**.

---

## 5. Universal Syllabus & 100-Page Book Ingestion (Macro-to-Micro Pipeline)

When dealing with massive curricula—such as a 100-page children's textbook, a complete National University syllabus, or a multi-unit certification program—generating all lessons in one prompt is impossible due to LLM output token constraints.

Pentabrid solves this with a **Two-Tier Hierarchical Pipeline**:
- **Macro Scan**: Ingests the entire document or syllabus text, extracting the high-level course code, title, difficulty, and modular unit outlines.
- **Micro Synthesis**: Allows publishing the complete course skeleton into the database with 1 click, followed by 1-click generation of each chapter's interactive lessons.

### 5.1 Ingestion Option A: Direct Book / Document Upload (PDF, TXT, MD)
1. In the Lesson Builder HUD, click **"Import Full Syllabus"** (purple book icon).
2. Ensure the **"Upload Book PDF / Document"** tab is selected.
3. Drag & drop or click the dropzone to select your file:
   - Supports **PDF books/syllabi up to 20MB**.
   - Supports raw text files (`.txt`, `.md`).
4. Click **"Extract Course Structure from PDF"**.
5. Gemini 2.5 Flash processes the native PDF pages using multimodal document scanning, extracting the full Table of Contents, course code, and modular breakdown.

### 5.2 Ingestion Option B: Raw Text / OCR Scraps
1. If you extracted text from physical book photos using Microsoft Copilot, Google Lens, or OCR:
2. In the "Import Full Syllabus" modal, switch to the **"Paste Text / OCR Scraps"** tab.
3. Paste the entire curriculum text into the text area.
4. Click **"Synthesize Universal Curriculum"**.

### 5.3 Publishing the Ingested Course to Database
1. Once the AI finishes scanning, an interactive blueprint card will appear displaying:
   - Detected Course Title & Code (e.g. *ICT-1101: Introduction to Information & Computer Systems*).
   - Course Difficulty & Extracted Units count.
   - Each module's breakdown with planned interactive lessons.
2. Click **"Publish Entire Course to Database"** (green button).
3. The course and all its modules are immediately created in your database and added to the public course catalog!
4. A green confirmation banner will appear with your new `Target Course ID`.

### 5.4 Synthesizing Chapters (1-Click vs. Canvas Review)
Under each module in the blueprint tree, every suggested lesson has two actions:

1. **Option 1: "Auto-Gen & Save" (1-Click Quick Commit)**:
   - Click the green **"Auto-Gen & Save"** button.
   - Gemini 2.5 Flash generates all interactive blocks for that specific chapter and commits them directly to the database under that module.
   - Upon completion, the button transforms into a green checkmark badge: `Saved (N blks) ✓`.
2. **Option 2: "Edit in Canvas"**:
   - Click **"Edit in Canvas"** to load the lesson prompt directly into the visual Lesson Builder.
   - You can review the blocks, edit custom text, change terminal commands, and save when ready.

---

## 6. Commerce & Manual bKash Payment Verification

Students in Bangladesh purchase premium courses using bKash manual send-money transactions. Administrators must review and approve these transactions to unlock course access.

### 6.1 Payment Verification Workflow:
1. Navigate to `/admin` and select the **"Payments & Invoices"** section.
2. You will see a table of all submitted student payments:
   - **Student Name & Email**
   - **Course Selected**
   - **Amount Paid (BDT)**
   - **bKash Transaction ID (TrxID)** (e.g. `9M7A6K5L`)
   - **Student Contact Number**
   - **Status Badge** (`PENDING`, `VERIFIED`, `REJECTED`)
3. Open your bKash Merchant or Personal statement and verify that the TrxID and amount match the incoming funds.
4. **To Approve**: Click the **"Verify & Grant Access"** (green checkmark) button.
   - The status updates to `VERIFIED`.
   - The student's dashboard immediately unlocks the course for full access.
5. **To Reject**: If the TrxID is fraudulent or the funds were not received, click **"Reject"**.

---

## 7. Student Inquiry & Helpdesk Management

Students can submit course queries, technical issues, or curriculum questions directly from their portal.

### 7.1 Managing Inquiries:
1. In the Admin HUD, navigate to the **"Student Inquiries"** section.
2. Review the list of open tickets:
   - Ticket Subject & Description
   - Submitting Student & Timestamp
   - Status: `OPEN`, `IN_PROGRESS`, `RESOLVED`
3. Click on a ticket to inspect details or reply.
4. Change the status to `RESOLVED` once addressed.

---

## 8. Backup, Recovery & Environment Variables

### 8.1 Key Environment Variables (`.env`)
| Variable | Description | Production Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@ep-xyz.aws.neon.tech/neondb` |
| `GEMINI_API_KEY` | Google AI Studio Key for Gemini 2.5 | `AIzaSy...` |
| `SMTP_SERVER` / `SMTP_PORT` | Outbound mail server (Gmail/SendGrid) | `smtp.gmail.com` / `587` |
| `SMTP_USERNAME` / `SMTP_PASSWORD`| Mail credentials (Use Gmail App Password) | `user@gmail.com` / `xxxx xxxx xxxx xxxx` |
| `SMTP_FROM_EMAIL` | Sender address | `Pentabrid Security <sany.alam.351@gmail.com>` |
| `NEXT_PUBLIC_API_URL` | Base URL for FastAPI backend | `https://api.yourdomain.com` |

### 8.2 Database Backups
- **PostgreSQL (Production)**: Automated snapshots via Neon console.
- **SQLite (Development)**: File located at `backend/pentabrid_dev.db`. Can be copied or backed up directly.

---

*End of Operations Manual. For technical escalations, consult the development team or file a ticket in the repository.*
