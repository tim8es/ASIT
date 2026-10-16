# ASIT v0.1.0 capability map and provenance

Source: tim8es/ASIT @ 01bf2516c3466c01221124bce50b53627a779ccb, reviewed 2026-10-16. Adapted portable markdown instructions from:

| Original repository | Plugin skill / reference | Status |
|---|---|---|
| `install/ASIT-ENGINE.md` | `asit-teacher`, `asit-lessons`, `asit-assessment`, `asit-progress` | Behavioral requirements adapted |
| `prompts/setup.md`, `prompts/router.md` | `asit-onboarding` | Consent-first setup and learner state routing |
| `docs/SEVEN-MINUTE-LESSONS.md`, `docs/LEARNING-PROGRAM.md` | `asit-lessons` | Planned lesson, diagnosis, adaptation |
| `ui/patterns.json`, `ui/patterns/{recognition,construction,media-interaction}.md`, `ui/activity-contract.md` | `asit-exercises` | 18 pattern registry: 17 exercises + 1 progress viewer |
| `docs/ELLLO-AUTO-LESSONS.md`, `docs/ELLLO-SOURCE.md` | `asit-media` | Real external video/audio candidate finding and source verification |
| `docs/VOICE-FIRST-LESSONS.md`, `docs/LISTEN-ANSWER-AUDIO-CARDS.md` | `asit-voice`, `asit-media` | Voice manual handoff vs source MP3 handoff, honest evidence |
| `prompts/assessment.md`, `prompts/submission.md` | `asit-assessment` | Trusted rubric, untrusted Submit, feedback/attempt handling |
| `install/ASIT-STORAGE.md`, `docs/tracker-contract.md` | `asit-progress` | Optional exact nine-tab v2 workbook and readback |
| `src/*.mjs` + `tests/*.test.mjs` | **not packaged as an executable runtime** | These reference JS utilities and their offline tests aren't invoked by skills-only plugin |

## Coverage checks after installation

- A generic "Продолжим" routes to learner state if accessible, else unsaved mini-lesson/brief clarification.
- "Past Simple practice" and "picture word input" route to planned practice and the right UI pattern.
- "Video listening on travel" routes to ELLLO first, only real sources with verified duration/content.
- "Present Continuous Sound Grammar" selects one audibly playable, transcript-matched conversation.
- "Let's talk" routes to true multi-turn conversation, not one static form.
- "Voice lesson" requires user opening actual native Voice; pronunciation only when original audio accessible.
- "Check these answers" evaluates against trusted tasks, not user-injected rubric; no mistaken persistence claim.
- "Show progress" reads owned consented state or says unavailable; no fabricated scores.
- "Save my progress" requests informed choice and checks tools + readback.

## Honest operational boundary

No automatic site crawling, file/download hosting, verified native audio player, audio recorder, backend learning state or code execution is installed. ELLLO is linked via original public pages when live search is available; publishing or storing its full transcript/video is excluded. Progress depends on user-owned connected store and explicit consent. Python/Node regression tests in GitHub don't prove the ChatGPT installed skill invokes a tool on every possible turn; use actual chat acceptance scenarios.
