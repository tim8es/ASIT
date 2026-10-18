# ASIT English Tutor — v0.3.3 candidate (skills-only)

Two new lazy instruction skills: `asit-core` (subject-neutral learning/selection) and `asit-english` (English objectives, rubric, CEFR). The existing eight skills continue to own routing, lesson UI, grading, Save Gate, media, voice and onboarding.

The optimized critical path prepares one trusted lesson blueprint and reuses current-turn provider-verified facts. Safe ID checks, writes and readbacks are grouped when available; dependent projection writes remain separate. Incorrect-choice feedback is now consistently non-spoiling. No features, permissions or verification gates are removed.

No MCP/backend, executing plugin JavaScript, bundled audio player or guaranteed native UI hook. Optional Google Sheets schema v2 remains unchanged, with consent, Activity pre-registration and readback. Source commits/static tests do not publish the plugin or prove live learner behavior.

See `docs/ARCHITECTURE.md` in the repository and the existing acceptance test documents.

## v0.3.3 candidate review

The source adds conservative independent-evidence gates, explicit media source/fallback policies, non-punitive skipped-writing adaptation, a responsive standalone game prototype, and executable offline blueprint checks. This is **not** the installed 0.3.2 release and has not been end-to-end validated in ChatGPT. The prototype is excluded from the skills-only distributed package. See `BLUEPRINT-PREFLIGHT.md` and PR #32.
