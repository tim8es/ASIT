# ASIT — Adaptive System for Intelligent Tutoring

**ChatGPT-native personal English tutor with an evidence-backed learning plan — MLP candidate.**

ASIT operates in a **normal ChatGPT conversation**, using native interactive controls when available. It does not host a separate website, call an external LLM API, or require a custom MCP server. A learner-owned storage connector (Google Drive / Sheets in v0.2) keeps progress between chats.

> **Status: MLP candidate for a private user test.** Automated reference tests and a synthetic Google Sheets integration check are available. Native ChatGPT first-run, interactive lesson and fresh-chat continuity still require user acceptance. Public release remains blocked by detached historical Git data.

## Start using ASIT

1. Connect GitHub to the private repository `tim8es/ASIT` with read permission. The GitHub-first router retrieves the actual current Engine in each new substantive-learning chat.
2. Paste the updated [PROJECT-ROUTER.md](install/PROJECT-ROUTER.md) **once** into **ChatGPT Project Instructions**. Existing Engine/Storage Project attachments may remain as clearly stale offline fallback snapshots.
3. Start a regular chat inside that Project and say **"Start my English program."** ASIT loads the engine, discovers the learner's goals and starts useful English practice.
4. Connect Google Drive *optionally* for private learning progress after explicit consent. Without it, the lesson remains unsaved.
5. Start another chat in the same Project to test source loading and state recovery.

**The connected GitHub tool is required for automatic source updates.** No hosted external frontend or paid API key is required. Changing a GitHub source does not itself update existing Project Instructions: the new router must be pasted once. Thereafter fresh chats fetch current Engine instructions from `main` without updating attachments.

## What is (and isn't) stored

- **GitHub:** reusable instructions, pedagogical constraints, UI patterns, empty schemas, deterministic helpers, fictional examples and tests.
- **Your private cloud storage:** language background, goals, competencies, plan, actual responses, assessments, recurring issues, review queue, and session history.
- **This chat:** temporary lesson rendering and dialogue context. UI state is not a durable database.

**Do not put real learner records, file IDs, access keys, recordings or raw replies into issues, commits, Actions logs or a public demo.** Never add a real person's profile to the repo.

## Design

ASIT does not assume your native language, English level, profession, country, session length, learning objectives, or preferred exercises. The onboarding agent discovers these on first run (or marks them unknown). It builds and revises an individual competency graph from CEFR-oriented communicative goals and observed performance.

Planned lessons **default to seven minutes and four varied exercises (up to five recommended)**: topic → grammar/language rule → one combined form → end vocabulary → one Submit → consolidated feedback. **Both lesson duration and exercise count are learner-configurable settings stored in private Learner State**, not hard system limits. The [UI Orchestrator](ui/UI-ORCHESTRATOR.md) selects controls by operation, evidence modality, accessibility and appropriate variety, lazily loading only relevant pattern specs. Initial diagnosis samples breadth instead of drilling a single error. Free conversation remains free conversation.

Every native activity sends a structured `ASIT_ATTEMPT_V2` conversation turn through its normal Submit action. The assistant validates the activity IDs, checks for existing evidence, evaluates and writes through the connected storage tool. It reports storage success only after reading the record back. No button pretends to write directly to Sheets.

## Contents

- [Project router](install/PROJECT-ROUTER.md), [teaching source](install/ASIT-ENGINE.md), and [onboarding workflow](prompts/setup.md)
- [Teacher router](prompts/router.md), [lesson selection](prompts/lesson-loop.md), [assessment](prompts/assessment.md) and [submission handler](prompts/submission.md)
- [Learning state](src/learning-state.mjs), [planner](src/planner.mjs), [message protocol](src/protocol.mjs)
- [UI Orchestrator](ui/UI-ORCHESTRATOR.md), [seven-minute lessons](docs/SEVEN-MINUTE-LESSONS.md), [18-pattern UI index](ui/patterns.json) (17 practice formats + 1 verified progress explorer), [UX dogfooding report](docs/UX-DOGFOOD-2026-10-16.md), [live feedback](docs/INTERACTIVE-FEEDBACK.md), [activity contract](ui/activity-contract.md)
- [Schema and private storage adapter](docs/tracker-contract.md), [privacy](docs/security.md), [release gate](docs/publication.md)
- [Human acceptance checks](docs/manual-acceptance.md), [evaluation fixtures](evals/README.md)
- [Capability limits](docs/architecture.md)

## Efficient, individualized runtime

The Router and Engine remain generic and unmodified throughout a learner's course. New sessions using the new router load current instructions from GitHub. A private `Config.adaptive_profile` holds evidence-linked individual difficulty and support decisions. The Storage adapter is a separate reference file, loaded on demand. Ordinary lessons use a [bounded learner context policy](docs/CONTEXT-PERFORMANCE.md), not a full history dump; heavy retrospective analyses opt in to scoped pagination.

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

### Expanded practice catalog (v0.5)

The registry includes 18 pattern contracts, including new `reading_comprehension`, `timeline_ordering` and capability-gated `image_hotspot`. Semantic-chunk sentence building and single-word card ordering now have clearly distinct rules. A real `dialogue` needs responsive chat turns. Playing and recording genuine audio depend on actual client tools and media access, not merely the presence of catalog entries. Reference Node.js helpers select patterns and verify evidence/progress contracts; **they do not install native ChatGPT UI components**. Test actual UX per [dogfooding / acceptance checklist](docs/UX-DOGFOOD-2026-10-16.md).

### Audio lessons directly inside ChatGPT

ASIT has a [Voice-first handoff](docs/VOICE-FIRST-LESSONS.md): a learner can tap the platform's Voice icon in the **same chat** and hold an interactive listening/speaking practice with a spoken tutor (when Voice is available). This is a *documented delivery route and reference planner*, not an installed audio playback/capture widget. A text transcript is not sufficient proof of pronunciation. `src/voice-session.mjs` and `tests/voice-session.test.mjs` explicitly distinguish unavailable Voice, actual audible prompts, learner audio review and supported listening. Bespoke `Play/Replay/Record` cards remain unimplemented until a real supported client audio path exists.

### Listen → Answer MP3 cards (self-paced listening)

Besides Voice-first speaking lessons, ASIT now has an explicit [Listen → Answer audio-card contract](docs/LISTEN-ANSWER-AUDIO-CARDS.md), offline reference grader (`src/listen-answer-card.mjs`) and tests. This format uses a **real MP3**, Replay/slow speed and text/choice questions with a transcript after answering. A self-contained **downloadable browser demo** may carry a generated audio clip inline; it is not automatically an installed embedded ChatGPT player. In-chat playback on mobile requires live acceptance and a supported audio attachment/player; unavailable audio results in `not_assessed`, not a fabricated listening grade.

### 2026-10-16 audio-card UX correction

**Inline Intelligent UI is the default** for Listen → Answer, not a standalone HTML file. Genuine audio playback may need a small inline audio-only adapter if the ChatGPT client supports it, while all questions, answer controls, feedback and Submit remain native. The original 22.05kHz/~32kbps TTS demo was rejected as poor quality; new recordings require a real natural-voice editorial check. See [updated audio card contract](docs/LISTEN-ANSWER-AUDIO-CARDS.md). Embedded audio support on mobile is still client-acceptance-gated; neither an MP3 attachment nor pure Node.js planner installs a universal inline audio widget.


### Short audio only: normal Listen → Answer cards

After real learner testing, **full audiobook chapters are forbidden in normal audio cards** even when instructions suggest listening to only the first minute. Cards require a genuine, *complete* 15–35 second stand-alone audio source with verified duration and 2–3 questions matched to the recorded excerpt. An explicit advanced/extended mode may use up to 90 seconds. Unverified length or long-source playback is rejected by `auditListeningDuration`; native Q&A and sound availability safeguards remain unchanged. See [the short-audio rule](docs/LISTEN-ANSWER-AUDIO-CARDS.md).


### First audio + video lesson source: ELLLO

ASIT uses **ELLLO** as its first preferred source of real English video/listening lessons. Initial use is **metadata-only discovery with original ELLLO page links** (no copied audio/video/transcripts), five checked source-page candidates with topic/level filters in `src/elllo-source.mjs` and tests in `tests/elllo-source.test.mjs`. The pilot focuses on `One Minute English` from people of different countries; longer grammar/conversation formats remain optional later. A One Minute title does **not** certify a <=35s source, verified mobile playback or permission to rehost video. See `docs/ELLLO-SOURCE.md`. No actual ELLLO media is embedded or saved to the repo.
