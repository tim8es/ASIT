# ASIT — Adaptive System for Intelligent Tutoring

**ChatGPT-native personal English tutor with an evidence-backed learning plan — MLP candidate.**

ASIT operates in a **normal ChatGPT conversation**, using native interactive controls when available. It does not host a separate website, call an external LLM API, or require a custom MCP server. A learner-owned storage connector (Google Drive / Sheets in v0.2) keeps progress between chats.

> **Status: MLP candidate for a private user test.** Automated reference tests and a synthetic Google Sheets integration check are available. Native ChatGPT first-run, interactive lesson and fresh-chat continuity still require user acceptance. Public release remains blocked by detached historical Git data.

## Start using ASIT

1. Download [ASIT-ENGINE.md](install/ASIT-ENGINE.md) **and** [ASIT-STORAGE.md](install/ASIT-STORAGE.md), then attach both to **ChatGPT Project Files / Knowledge**.
2. Paste only [PROJECT-ROUTER.md](install/PROJECT-ROUTER.md) into **ChatGPT Project Instructions** (approximately 1,800 characters).
3. Start a regular chat inside that Project and say **"Start my English program."** ASIT loads the engine, discovers the learner's goals and starts useful English practice.
4. Connect Google Drive *optionally* for private learning progress after explicit consent. Without it, the lesson remains unsaved.
5. Start another chat in the same Project to test source loading and state recovery.

**No GitHub connector, command line, separate website or paid API key is required for the learner.** GitHub is the source of truth for updates; attached Project files are not automatically synced.

## What is (and isn't) stored

- **GitHub:** reusable instructions, pedagogical constraints, UI patterns, empty schemas, deterministic helpers, fictional examples and tests.
- **Your private cloud storage:** language background, goals, competencies, plan, actual responses, assessments, recurring issues, review queue, and session history.
- **This chat:** temporary lesson rendering and dialogue context. UI state is not a durable database.

**Do not put real learner records, file IDs, access keys, recordings or raw replies into issues, commits, Actions logs or a public demo.** Never add a real person's profile to the repo.

## Design

ASIT does not assume your native language, English level, profession, country, session length, learning objectives, or preferred exercises. The onboarding agent discovers these on first run (or marks them unknown). It builds and revises an individual competency graph from CEFR-oriented communicative goals and observed performance.

Planned lessons **default to seven minutes and four varied exercises (up to five recommended)**: topic → grammar/language rule → one combined form → end vocabulary → one Submit → consolidated feedback. **Both lesson duration and exercise count are learner-configurable settings stored in private Learner State**, not hard system limits. The [UI Orchestrator](ui/UI-ORCHESTRATOR.md) selects controls by operation, evidence modality, accessibility and appropriate variety, lazily loading only relevant pattern specs. Initial diagnosis samples breadth instead of drilling a single error. **Remediation and spaced review use the same complete multi-exercise, single-submit lesson UX**; partial answers never silently trigger serial one-question retries. One-off questions remain available when explicitly requested. This is a universal Engine rule, not an individual Learner State preference. Free conversation remains free conversation.

Every native activity sends a structured `ASIT_ATTEMPT_V2` conversation turn through its normal Submit action. The assistant validates the activity IDs, checks for existing evidence, evaluates and writes through the connected storage tool. It reports storage success only after reading the record back. No button pretends to write directly to Sheets.

## Contents

- [Project router](install/PROJECT-ROUTER.md), [teaching source](install/ASIT-ENGINE.md), and [onboarding workflow](prompts/setup.md)
- [Teacher router](prompts/router.md), [lesson selection](prompts/lesson-loop.md), [assessment](prompts/assessment.md) and [submission handler](prompts/submission.md)
- [Learning state](src/learning-state.mjs), [planner](src/planner.mjs), [message protocol](src/protocol.mjs)
- [UI Orchestrator](ui/UI-ORCHESTRATOR.md), [seven-minute lessons](docs/SEVEN-MINUTE-LESSONS.md), [native patterns](ui/patterns.json), [activity contract](ui/activity-contract.md)
- [Schema and private storage adapter](docs/tracker-contract.md), [privacy](docs/security.md), [release gate](docs/publication.md)
- [Human acceptance checks](docs/manual-acceptance.md), [evaluation fixtures](evals/README.md)
- [Capability limits](docs/architecture.md)

## Efficient, individualized runtime

The Router and Engine remain generic and unmodified throughout a learner's course. A private `Config.adaptive_profile` holds evidence-linked individual difficulty and support decisions. The Storage adapter is a separate reference file, loaded on demand. Ordinary lessons use a [bounded learner context policy](docs/CONTEXT-PERFORMANCE.md), not a full history dump; heavy retrospective analyses opt in to scoped pagination.

## MLP testing

[Two-part setup](install/START_HERE.md) · [Step-by-step test](docs/MLP-ACCEPTANCE.md) · [Learning program](docs/LEARNING-PROGRAM.md) · [Native lesson UX](ui/MLP-EXPERIENCE.md) · [Release scope](docs/MLP-RELEASE.md)

## Verified engineering evidence

[Verification report](docs/verification-2026-10-15.md) · [Acceptance gates](docs/acceptance.md) · [Public release safety](docs/publication.md)

## Test

```bash
npm test
npm run audit
```

CI runs both on pushes and pull requests. Passing tests does not prove real language acquisition.

## Requirements and limits

A ChatGPT account with the necessary native UI and external connector capabilities. Google Sheets connector availability and interaction support vary by client and account. If native controls are unsupported, use text conversation; if storage is unavailable, show a **not saved** warning and provide an exportable state update. A concurrent multi-user transactional backend is **not** implemented; no atomic exactly-once claim.

## License

[MIT](LICENSE). No personal learner data or user-owned files are included in the project.
