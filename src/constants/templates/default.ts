export const DEFAULT_RESUME_MARKDOWN = `
---
name: Alex Dev
header:
  - text: email@example.com
    link: mailto:email@example.com
  - text: linkedin.com/in/alexdev
    link: https://linkedin.com/in/alexdev
  - text: github.com/alexdev
    link: https://github.com/alexdev
---

## Experience

**Senior Backend Engineer** | FinTech Solutions | Jakarta, Indonesia
~ 2021 - Present

- **Orchestrated** the migration of a legacy monolithic payment system to a microservices architecture, reducing deployment time by **85%** (from 2 days to 4 hours) and enabling daily releases.
  <!-- 
  CONTEXT (STAR):
  Situation: The legacy Java monolith was fragile; one error crashed the whole payment gateway. Deployments were "fear-based" and only happened monthly.
  Task: Decouple the payment processing module without downtime.
  Action: I advocated for the "Strangler Fig" pattern. I led a team of 3 juniors, set up the Docker/K8s infrastructure, and wrote the new services in Go.
  Result: Zero downtime during switchover. The business could now launch features weekly instead of monthly.
  Tech Details: Java Spring Boot (Legacy) -> Go (New), gRPC, Kubernetes, ArgoCD.
  -->

- **Engineered** a real-time fraud detection pipeline that processed **5,000 transactions per second**, saving the company an estimated **$200k annually** in chargeback fees.
  <!-- 
  CONTEXT (STAR):
  Situation: Fraud rules were running on a nightly SQL batch job. By the time we caught fraud, the money was gone.
  Task: Move to real-time analysis.
  Action: I introduced Apache Kafka to stream events and Redis for sub-millisecond state lookups. Had to convince the CTO to approve the infrastructure cost.
  Result: Fraud detection latency dropped from 24 hours to <100ms.
  Tech Details: Kafka, Redis Cluster, Python.
  -->

- **Optimized** critical database queries for the user dashboard, slashing page load latency by **60%** and improving user retention metrics.
  <!-- 
  CONTEXT (STAR):
  Situation: Enterprise clients were complaining that the reporting dashboard took 10+ seconds to load.
  Action: Used \`EXPLAIN ANALYZE\` to identify N+1 query issues. Implemented a materialized view strategy for heavy reports.
  Result: Load times dropped to <2 seconds. Client complaints stopped immediately.
  Tech Details: PostgreSQL, SQL Optimization, Materialized Views.
  -->

**Software Engineer** | E-Commerce Startup | Remote
~ 2019 - 2021

- **Automated** the manual inventory reconciliation process using Python scripts, eliminating **20 hours of manual work per week** for the operations team.
  <!-- 
  CONTEXT (STAR):
  Situation: The Ops team was manually copying data from Excel to the database every Friday. It was error-prone.
  Action: I wrote a script to parse the CSVs and update the DB via API. Set it to run on a Cron job.
  Result: Operations team was able to focus on vendor relationships instead of data entry. Error rate dropped to near zero.
  -->

## Projects

**Distributed File Storage System** | GitHub | 2023
- Designed a fault-tolerant file storage system modeled after GFS, handling node failures without data loss.
  <!-- 
  Context: Built this to learn distributed consensus. Implemented a simplified Raft algorithm. Hardest part was handling "split-brain" scenarios. 
  -->

## Education

**B.S. Computer Science** | University of Indonesia | 2019
- Graduated Cum Laude; Specialization in Distributed Systems.

## Skills

**Languages:** Go (Golang), Python, Java, SQL
**Backend:** Microservices, gRPC, REST APIs, Node.js
**Data & Storage:** PostgreSQL, Redis, Apache Kafka, MongoDB
**DevOps & Tools:** Docker, Kubernetes, AWS (EC2, S3, Lambda), CI/CD (GitHub Actions)
`;

export const DEFAULT_RESUME_CUSTOM_CSS = ``;
