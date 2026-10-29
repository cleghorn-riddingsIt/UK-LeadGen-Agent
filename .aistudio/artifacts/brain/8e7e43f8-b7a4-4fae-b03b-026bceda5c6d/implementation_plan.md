# UK AI Job Lead Generation Agent & Operator Command Center

A high-precision, zero-touch autonomous trawler and lead generation command center that searches UK job vacancy portals for remote and hybrid positions, applies strict salary floor and technical skill filters, tailors verifiable CVs, and routes verified recruiter intent directly to candidate Telegram/Gmail while keeping the candidate 100% zero-touch until an interview or meeting is requested.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your selections during Phase 1 clarification, the system architecture and implementation will adhere to these core parameters:

- **Confirmed Application Scope**: Full **Operator Command Center** featuring live crawler run controls, real-time scraping logs, vacancy triage queue, candidate profile & Fact Bank editor, and applicant pipeline Kanban.
- **Confirmed Ingestion Strategy**: **Hybrid sourcing engine** combining high-throughput UK vacancy APIs (Adzuna UK & Reed UK endpoints with commute radius & salary filters) with resilient **Playwright** headless browser workers for direct employer ATS boards (Greenhouse, Lever, Workday, Ashby) and fallback job boards.
- **Confirmed Domain & Seniority Scope**: **Configurable across any tech specialization** (Software Engineering, AI/ML, DevOps, Cloud Architecture, Data Engineering, Product) via a dynamic candidate onboarding Fact Bank with customizable skill taxonomies and salary thresholds.
- **Scraping Safety & Anti-Bot Policy**: CAPTCHAs skipped (never bypassed, as mandated by the TS v0.2 spec), anti-fingerprinting stealth Playwright profiles, human-like delay jitter, and zero scraping from candidate personal LinkedIn accounts.
- **Database Strategy**: Production schema modeled for **PostgreSQL + pgvector** (with unified embedded SQLite/LibSQL vector storage for local instant zero-dependency execution), storing vectorized job descriptions, candidate facts, ATS scorecards, and audit trails.

---

## 1. Overview & Core Concept

### What It Does
The system operates as an end-to-end autonomous job acquisition engine for UK-based professionals. Rather than acting as a generic mass-mailer, it functions as a high-precision conversion funnel:
1. **Sourcing**: Continuously trawls UK job portals (Adzuna, Reed, CV-Library, Indeed UK, direct ATS boards) for remote and hybrid positions matching commute radius, right-to-work requirements, and salary floors.
2. **Parsing & Deduplication**: Extracts structured requirements (salary range, tech stack, remote policy, visa sponsorship, hiring company) and deduplicates multi-posted listings across recruiters and agencies.
3. **Semantic Matching**: Evaluates vacancy requirements against the candidate's verified Fact Bank using Gemini 3.8 Flash for fast filtering and vector embeddings for semantic alignment.
4. **Pre-Send ATS Simulation & CV Tailoring**: Tailors a 2-page British English CV where every claimed skill traces to an immutable Fact ID (zero fabrication). Runs an ATS keyword and structure simulation (titles, dates, skills $\ge 80\%$ match; clean parse $= 100\%$).
5. **Zero-Touch Execution & Intent Handoff**: Logs applications in the database, tracks Gmail deliverability ($\le 20\text{–}30$ emails/day with bounce guard), and instantly fires a Telegram alert within $\le 5$ minutes when an employer replies with interview intent or scheduling links.

### Target Audience & Persona
- **Candidate**: UK resident tech specialist who sets parameters once (Fact Bank, salary floor, remote/hybrid preference, UK right-to-work confirmation) and does nothing until an employer initiates an interview.
- **Operator**: System manager monitoring crawler health, ATS pass rates, API quotas, proxy pools, and delivery reputation across the pipeline.

### Key Value
Converts passive job hunting into high-converting inbound meetings while protecting candidate Gmail domain reputation, eliminating spam rejections, and guaranteeing 100% truthful applications.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               OPERATOR WORKSPACE FLOW                                  │
├───────────────────┬───────────────────┬──────────────────────┬─────────────────────────┤
│ 1. PROFILE & FACT │ 2. LIVE CRAWLER   │ 3. MATCHING & ATS    │ 4. PIPELINE KANBAN &    │
│    BANK ONBOARD   │    COMMAND        │    SIMULATOR         │    INTENT HANDOFF       │
│                   │                   │                      │                         │
│ • UK Right to Work│ • Launch Adzuna / │ • Keyword coverage % │ • Vacancies Found       │
│ • Skills & Stacks │   Reed API sync   │ • Fact-ID trace view │ • Filtered / Matched    │
│ • Salary floor (£)│ • Playwright ATS  │ • Gemini Pro CV      │ • Sent / In Flight      │
│ • Verified claims │   browser crawler │   preview & verify   │ • Intent (Interview/    │
│   (Fact IDs 1..N) │ • Live run stats  │ • Auto-reject audit  │   Test Task / Action)   │
└───────────────────┴───────────────────┴──────────────────────┴─────────────────────────┘
```

1. **Dashboard Home (Overview)**: Real-time KPI cards (`Meetings Initiated`, `ATS Pass Rate %`, `Daily Gmail Send Volume`, `Active Crawler Runs`), system status strip, and immediate action items requiring Operator review.
2. **Crawler & Trawler Console**: Interactive job board crawler runner. Select targets (Adzuna UK API, Reed UK API, Greenhouse/Lever ATS, Indeed UK), configure search queries (`TypeScript`, `Full Stack`, `Remote UK`, `£75k+`), and watch structured vacancy extraction with live progress logs.
3. **Vacancy Triage & Matching Studio**: Interactive table of scraped vacancies with remote/hybrid tags, salary ranges, location commute distance, and instant Gemini match scoring. View side-by-side gap analysis between vacancy requirements and candidate facts.
4. **Candidate Fact Bank & ATS Tailor**: The single source of truth for candidate experience. Add verified achievements with unique Fact IDs. Generate and inspect tailored CVs and cover letters, ensuring zero untraced claims and previewing ATS simulation scores.
5. **Handoff & Intent Monitor**: Interactive simulation and live view of candidate handoffs: incoming recruiter emails parsed for intent (Meeting Link, Screening Call, Document Request, Auto-reply, Rejection), with Telegram alert payloads formatted for instant candidate takeover.

### Visual Identity & Theme
- **Domain & Aesthetic Direction**: Enterprise Data & Operator Console (following `references/3_saas_dashboard.md`), utilitarian, data-dense, crisp, and distraction-free.
- **Color Palette & Discipline (60-30-10)**:
  - *Canvas (60%)*: Neutral deep slate (`#0B0F17`) dark mode canvas with cool graphite structural panels (`#131B2A`).
  - *Structural Surfaces (30%)*: Card and table backgrounds (`#1E293B`), hairline borders (`#334155` / `rgba(255,255,255,0.08)`), and muted typography (`#94A3B8`).
  - *Accent Budget (10%)*: High-intent emerald (`#10B981`) for high match scores/active scrapers, amber (`#F59E0B`) for ATS rework warnings, and crisp sky-blue (`#38BDF8`) for primary CTAs and active tabs.
- **Zero-Pill Discipline**: Metadata (salary, remote format, dates, company, recruiter name) rendered as clean unboxed text separated by typographic middots (`·`) or slashes (`/`). Interactive filters use clean segmented tab buttons.
- **Typography**:
  - *Display / Headings*: `Plus Jakarta Sans` for crisp brand and section hierarchy.
  - *Body Prose*: `DM Sans` for dense, highly legible candidate facts and vacancy descriptions.
  - *Numbers & Data*: Strictly monospace tabular figures (`font-mono tabular-nums`, `JetBrains Mono`) for salaries, match percentages, ATS scores, and timestamps.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Hybrid Scraper Architecture (UK Job APIs + Playwright Headless Browser)
- **Chosen Approach**:
  - Direct UK Developer APIs for **Adzuna UK** and **Reed UK**: Provides high-throughput, structured vacancy ingestion (salary ranges, locations, posted dates) without risk of bot detection or IP bans.
  - Resilient **Playwright headless workers** for direct employer ATS boards (Greenhouse, Lever, Workday) and dynamic vacancy portals: Uses headless Chromium with stealth evasions (`user-agent` rotation, viewport randomization, disabled `navigator.webdriver`), skipping CAPTCHA-blocked portals as mandated by the TS spec.
- **Why**: Pure headless scraping across every site triggers anti-bot blocks and high maintenance. Official UK job board APIs guarantee reliable structured data, while Playwright handles high-value direct employer portals.
- **Trade-Off**: Direct employer scraping requires schema-specific parsers (handled modularly via ATS adapter classes: `GreenhouseAdapter`, `LeverAdapter`, `AdzunaAdapter`, `ReedAdapter`).

### Decision 2: Robust Database & Vector Strategy
- **Chosen Approach**: Unified database architecture designed for PostgreSQL + `pgvector`, implemented with a high-performance local SQLite/LibSQL database layer with full vector-similarity search and jsonb-compatible columns for immediate zero-friction local execution, ready for Cloud SQL PostgreSQL connection.
- **Why**: Provides instant setup in the AI Studio container without requiring external database provisioning upfront, while maintaining 100% schema parity with PostgreSQL.
- **Core Entities**:
  - `CandidateProfile`: Right to work, location, commute radius, salary floor, target titles, blacklist companies.
  - `CandidateFactBank`: Discrete, verifiable facts with unique `fact_id`, category, dates, and verification status.
  - `Vacancies`: Deduplicated vacancy records, salary min/max, commute policy, raw text, requirements vector.
  - `MatchScores`: Semantic match score, missing skills, hard filter pass/fail flag.
  - `Applications`: Tailored CV markdown, Fact ID trace matrix, ATS simulation score, dispatch status, Gmail thread ID.
  - `HandoffEvents`: Intent classification, employer message snippet, candidate Telegram alert payload.

### Decision 3: Truthful CV Engine with Strict Fact-Tracing
- **Chosen Approach**: Every bullet point generated in the tailored CV must reference an existing `fact_id` in the candidate's Fact Bank. Gemini Pro / Argon acts as the CV Tailor; a separate Verifier agent cross-checks that no hallucinated claim or untraced statistic exists before an application can be dispatched.
- **Why**: Candidate reputation is paramount. Fabricated skills fail technical interviews; traceable CVs pass ATS screens while remaining 100% honest.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           OPERATOR COMMAND CENTER (FRONTEND)                           │
│  React 19 + TypeScript + Tailwind CSS (Plus Jakarta Sans + Monospace Tabular Figures)  │
│                                                                                        │
│  ┌────────────────────┐ ┌────────────────────┐ ┌───────────────────┐ ┌───────────────┐ │
│  │ Metrics & Status   │ │ Crawler & Trawler  │ │ Vacancy Matching  │ │ Fact Bank &   │ │
│  │ Overview           │ │ Live Console       │ │ & ATS Studio      │ │ Handoff Log   │ │
│  └─────────┬──────────┘ └─────────┬──────────┘ └─────────┬─────────┘ └───────┬───────┘ │
└────────────┼──────────────────────┼──────────────────────┼───────────────────┼─────────┘
             ▼                      ▼                      ▼                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FULL-STACK BACKEND ENGINE (server.ts)                           │
│  Express 4 + Node.js runtime + SSE live streaming log channels                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐  ┌─────────────────────────┐  ┌──────────────────────────┐  │
│  │ Crawler Orchestrator  │  │ AI Multi-Agent Service   │  │ ATS Simulation & Fact    │  │
│  │ • Adzuna UK API client│  │ • Gemini Flash Parser    │  │   Verifier Engine        │  │
│  │ • Reed UK API client  │  │ • Gemini Match Scorer    │  │ • Keyword density check  │  │
│  │ • Playwright Scraper  │  │ • CV Tailor (Fact-ID)    │  │ • Section parser check   │  │
│  │   (ATS boards/Stealth)│  │ • Intent Classifier      │  │ • Traceability auditor   │  │
│  └──────────┬────────────┘  └────────────┬─────────────┘  └────────────┬─────────────┘  │
│             │                            │                             │                │
│             ▼                            ▼                             ▼                │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                        ROBUST STORAGE & REPOSITORY LAYER                          │  │
│  │   PostgreSQL / SQLite Storage Engine with Vector Cosine Similarity Search         │  │
│  │   • vacancies  • candidate_facts  • applications  • crawler_runs  • handoffs      │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Ingestion & Playwright Scraping Architecture
1. **API Collectors (`/api/crawlers/api-sync`)**:
   - Queries Adzuna & Reed for UK vacancies matching query, country (`gb`), location (e.g. `London`, `Manchester`, `Remote`), and salary floor (`min_salary=70000`).
   - Normalizes salary formats (£ per annum / daily contractor rates).
2. **Playwright Scraper Engine (`/api/crawlers/playwright-run`)**:
   - Spawns headless browser with anti-detect settings: custom `User-Agent`, disabled automation flags, random viewport sizes ($1366\times768$ to $1920\times1080$), natural scroll delays.
   - Extracts vacancy title, company, description, apply URL, location, and ATS metadata.
   - Bypasses or gracefully aborts on Cloudflare/CAPTCHA barriers without hanging.
3. **Deduplication & Cross-Agency Filtering**:
   - Normalizes company name + job title + location fingerprint.
   - Cross-checks against existing vacancy hashes in the database to prevent duplicate applications.

### State & Flow Implementation Plan
- **Phase 1: Database & Backend Scraper Setup**:
  - Configure `server.ts` with Express and persistent database repository.
  - Implement UK job scrapers: Adzuna/Reed API adapters + Playwright ATS board crawler engine with live status SSE/event logs.
  - Implement Gemini API server-side routes for vacancy parsing, candidate matching, and ATS screening.
- **Phase 2: Operator Command Center UI**:
  - Build navigation and top bar contract (Brand wordmark, views, primary crawler action).
  - Metrics overview with zero-pill data display.
  - Crawler runner modal and live log stream viewer.
- **Phase 3: Vacancy Matching & Candidate Studio**:
  - Interactive vacancy table with filters (salary slider, remote/hybrid toggle, skill badges).
  - Fact Bank editor with verification status and fact traceability.
  - ATS simulation report card and CV preview with Fact-ID tags.
- **Phase 4: Intent Handoff & Telegram Simulator**:
  - Inbound reply classifier (Interview, Test Task, Rejection, Auto-reply).
  - Live Telegram notification simulator with one-click candidate takeover.
