# oh-my-cv Resume Format Guide for LLMs (2026 Edition)

This guide explains the markdown format used by oh-my-cv, updated with 2026 industry standards for ATS optimization and human readability.

---

## Philosophy: The "Brochure vs. Database" Protocol

**Crucial Instruction for LLMs:**
1.  **The Brochure (Visible):** The rendered resume is a high-impact marketing document designed for a **6-second human scan** and **ATS parsing**. It must use the **XYZ Formula** (Accomplished [X] as measured by [Y], by doing [Z]).
2.  **The Database (Hidden):** Users often provide rich details (STAR narratives, specific tech versions, team dynamics) that are too dense for the brochure. **Do not discard this.** Preserve it in **Markdown Comments**.

---

## Professional Resume Format

### 1. Front Matter (YAML) & File Naming

**Standard:** `FirstName_LastName_Role_Resume.pdf` (e.g., `Jordan_Smith_Frontend_Engineer.pdf`)

```yaml
---
name: Your Name
header:
  - text: City, State (e.g., Austin, TX)
  - text: email@example.com
    link: mailto:email@example.com
  - text: linkedin.com/in/custom-url
    link: https://linkedin.com/in/custom-url
  - text: github.com/username
    link: https://github.com/username
---
```
*Note: Do not include full physical addresses or photos (unless specifically requested by region).*

### 2. Professional Summary (The Hook)

Replace old "Objectives" with a "Value Proposition."
**Formula:** [Current Title] + [Years Exp] + [Core Stack] + [One Major Quantified Win].

```markdown
## Profile

**Senior Backend Engineer** with 6+ years of experience architecting distributed systems using **Go** and **Kubernetes**. Spearheaded a cloud migration that reduced infrastructure costs by 30% while maintaining 99.99% uptime.
```

### 3. Experience (The Core Narrative)

**Rule:** Use the **XYZ Formula** for visible text. Use **Comments** for the Interview Cheat Sheet.

**Pattern:** 1 bold term + N `~` lines = 1 row with (N+1) columns.

```markdown
## Experience

**Senior Software Engineer**    
  ~ TechCorp (FinTech)                 
  ~ 2022-Present

- Reduced API latency by 40% (Y) by implementing Redis look-aside caching and optimizing SQL queries (Z)
  <!-- 
  STAR / Interview Context:
  Situation: Search API timed out during Black Friday traffic.
  Task: Fix latency under 200ms.
  Action: Identified N+1 query issues. Implemented Redis cluster.
  Result: Latency dropped 200ms -> 120ms. 
  Tech: Redis v6, PostgreSQL 14, raw SQL optimization.
  -->

- Architected a microservices migration that scaled system to 100k concurrent users
  <!-- 
  Context: Strangler Fig pattern used. 
  Team: Led 4 juniors. 
  Conflict: Had to convince CTO to move away from Monolith. 
  -->
```

### 4. Skills (Taxonomy of Competence)

Group skills logically. **Exclude** basics (Word, Email). **Include** modern AI productivity tools.

```markdown
## Skills

**Languages:** TypeScript, Go, Python, Rust <!-- Context: Python used for Data/AI, Go for backend services -->

**Frontend:** React, Next.js, Tailwind CSS, State Management (Zustand)

**Backend:** Node.js, GraphQL, gRPC, PostgreSQL, Redis

**Infra & AI:** AWS (Lambda, S3), Kubernetes, Terraform, LLM Integration (OpenAI API, Copilot)
```

### 5. Projects (The Portfolio)

Treat the Repo as a Product.

```markdown
## Projects

**E-Commerce Analytics Engine**
  ~ [github.com/user/repo](https://github.com)
  ~ 2025

- Built a real-time dashboard processing 5TB of data daily using Kafka and ClickHouse
  <!-- 
  Repo Hygiene: Includes full Docker setup and comprehensive README. 
  Live Demo: deployed on Vercel. 
  -->
```

---

## Academic Resume Format

### Everything in Professional, PLUS:

### Publications

```markdown
## Publications

[~P1]: **Novel Approach to Machine Learning**

    Jane Doe, John Smith

    *NeurIPS 2022 (Acceptance Rate: 25%)*
    <!-- Contribution: I designed the core algorithm. -->
```

### Technical Notation

Use KaTeX for math `$...$` to demonstrate technical depth without formatting errors.

```markdown
**Research Interests:** Stochastic Gradient Descent, $O(n \log n)$ Optimization
```

---

## Notes for LLMs (System Instructions)

### 1. ATS & Formatting Rules
*   **Layout:** Keep the Markdown **linear**. Do not create complex visual tables. Use the `~` syntax only for header lines (Role/Company/Date).
*   **Fonts/Space:** Do not "cram". If the resume is too long, cut the oldest/least relevant experience, but **save the details in comments**.
*   **Keywords:** Inject high-impact keywords from the user's input (e.g., "Microservices," "CI/CD," "System Design") into the Skills and Experience sections.

### 2. The XYZ Transformation
*   **Input:** "I worked on the database."
*   **LLM Output:** "Optimized database schemas reducing query time by 20%."
*   **Comment Output:** `<!-- Task: Normalized tables. Tool: PostgreSQL explain analyze. -->`

### 3. Interview Prep (The Hidden Value)
*   ALWAYS move specific "STAR" details, team sizes, conflict resolutions, and specific tech versions into `<!-- HTML Comments -->`.
*   This ensures the user remembers *exactly* what to say when asked "Tell me about a time you optimized a system..."

### 4. Quality Assurance Checklist
*   [ ] Is the filename format correct?
*   [ ] Are vague words (helped, worked on) replaced with Power Verbs (Architected, Deployed)?
*   [ ] Are generic skills (MS Word, Windows) removed?
*   [ ] Is the "Repo as a Product" principle applied to Projects?