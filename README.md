# ASIT — Adaptive System for Intelligent Tutoring

**ChatGPT-native personal English tutor with an evidence-backed learning plan.**

ASIT operates in a **normal ChatGPT conversation**, using native interactive controls when available. It does not host a separate website, call an external LLM API, or require a custom MCP server. A learner-owned storage connector (Google Drive / Sheets in v0.2) keeps progress between chats.

> **Status: v0.2 experimental, not a turnkey released product.** A real submission and Google Sheets readback have been demonstrated in a private pilot. Cross-chat restoration, full-course adaptation, voice integration, and clean public distribution remain acceptance gates.

## Start using ASIT

1. Copy the **[self-contained ChatGPT Project instructions](install/CHATGPT-PROJECT-INSTRUCTIONS.md)** into ChatGPT Project settings. **No GitHub connector required** for basic teaching.
2. Optionally connect **Google Drive** to preserve progress. Without it, sessions remain explicitly unsaved.
3. Start a **normal chat inside the Project** and say **"Start my English program."** The agent asks for storage consent and your learning goals, then prepares an individual plan.
4. In the next chat inside the same Project, ASIT restores available evidence from your private workbook. Outside the Project, paste the instruction again.

No Node.js or server setup is needed to study. Node.js 22 is needed **only** for contributors running offline tests.

## What is (and isn't) stored

- **GitHub:** reusable instructions, pedagogical constraints, UI patterns, empty schemas, deterministic helpers, fictional examples and tests.
- **Your private cloud storage:** language background, goals, competencies, plan, actual responses, assessments, recurring issues, review queue, and session history.
- **This chat:** temporary lesson rendering and dialogue context. UI state is not a durable database.

**Do not put real learner records, file IDs, access keys, recordings or raw replies into issues, commits, Actions logs or a public demo.** Never add a real person's profile to the repo.

## Design

ASIT does not assume your native language, English level, profession, country, session length, learning objectives, or preferred exercises. The onboarding agent discovers these on first run (or marks them unknown). It builds and revises an individual competency graph from CEFR-oriented communicative goals and observed performance.

Lesson loop: restore state → select skill → short retrieval/diagnosis → scaffolded input → natural production → selective feedback → retry → evidence write → readback → update plan. Free conversation remains free conversation.

Every native activity sends a structured `ASIT_ATTEMPT_V2` conversation turn through its normal Submit action. The assistant validates the activity IDs, checks for existing evidence, evaluates and writes through the connected storage tool. It reports storage success only after reading the record back. No button pretends to write directly to Sheets.

## Contents

- [One-paste setup](install/CHATGPT-PROJECT-INSTRUCTIONS.md) and [onboarding workflow](prompts/setup.md)
- [Teacher router](prompts/router.md), [lesson selection](prompts/lesson-loop.md), [assessment](prompts/assessment.md) and [submission handler](prompts/submission.md)
- [Learning state](src/learning-state.mjs), [planner](src/planner.mjs), [message protocol](src/protocol.mjs)
- [Native UI patterns](ui/patterns.json), [activity contract](ui/activity-contract.md)
- [Schema and private storage adapter](docs/tracker-contract.md), [privacy](docs/security.md), [release gate](docs/publication.md)
- [Human acceptance checks](docs/manual-acceptance.md), [evaluation fixtures](evals/README.md)
- [Capability limits](docs/architecture.md)

## Test

```bash
node --test tests/*.test.mjs
node scripts/scan-public.mjs
```

CI runs both on pushes and pull requests. Passing tests does not prove real language acquisition.

## Requirements and limits

A ChatGPT account with the necessary native UI and external connector capabilities. Google Sheets connector availability and interaction support vary by client and account. If native controls are unsupported, use text conversation; if storage is unavailable, show a **not saved** warning and provide an exportable state update. A concurrent multi-user transactional backend is **not** implemented; no atomic exactly-once claim.

## License

[MIT](LICENSE). No personal learner data or user-owned files are included in the project.
