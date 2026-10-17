# Legacy cleanup audit — 2026-10-17

## Confirmed original split
- Source `plugin/` lagged the installed personal plugin (`0.2.7` versus installed `0.2.10`). Proposed source `0.2.11` begins by synchronizing the installed release.
- Removed unused alternate runtime: `src/*.mjs` (planner, state, CEFR, UI, ELLLO and storage oracles), root `package.json`, `tests/*.mjs` and root `scripts/*.mjs`.
- Removed obsolete GitHub-first delivery: `install/`, `prompts/`, `ui/`, legacy architecture docs and their fixture directories.
- Old schema/template fixtures and illustrative curriculum were not private learner data. Nine-tab exact storage contract already lives in `plugin/skills/asit-progress/references/storage-v2.md`; illustrative can-dos now live in `plugin/skills/asit-lessons/references/can-do-starters.md`.

## Functionality retained inside actual plugin sources
| Previous offline module | Maintained skill contract |
| --- | --- |
| `src/planner.mjs`, `adaptation-policy.mjs` | `asit-lessons/references/selection-invariants.md` |
| `src/learning-state.mjs`, `analytics.mjs` | `asit-progress/references/evidence-review.md` and CEFR analytics |
| `src/store-gateway.mjs`, `storage-contract.mjs`, `sheets-bootstrap.mjs`, `hydrate-state.mjs` | `asit-progress/references/storage-v2.md`, storage setup and assessment attempt protocol |
| `src/elllo-source.mjs`, `elllo-activity-pipeline.mjs`, `listen-answer-card.mjs` | `asit-media/references/elllo-source-validation.md`, media-quality |
| `src/ui-orchestrator.mjs`, `lesson-journey.mjs`, `lesson-blueprint.mjs` | `asit-exercises/references/pattern-registry.md`, lesson experience planner, auto-continuation |
| `src/voice-session.mjs` | `asit-voice/SKILL.md` |
| `curriculum/competencies.json` | `asit-lessons/references/can-do-starters.md` |

This is **behavioral porting of policies**, NOT a conversion into runnable code or a byte-for-byte equivalent. No JS execution, automatic scheduling or transactional guarantees are implied. Repository Python tests are static acceptance checks; the host and Google Sheets still need dogfooding.

## Important limits and follow-ups
- The repo cleanup PR changes tracked files in a new commit. It does not purge objects from Git history or ensure historical credential safety. Do not publish the repository solely because the working tree is clean; conduct a separate Git-history/security review and rotate any exposed credentials.
- Do not release the proposed v0.2.11 source until PR review, static tests, host UI/audio QA and truthful saving tests. Plugin Creator publication is independent from GitHub merge.
- Runtime guarantees such as fully automatic Save Gate, true audio telemetry, deterministic grading of free writing and mathematical CEFR calibration still cannot be supplied by Skills-only prompts.
