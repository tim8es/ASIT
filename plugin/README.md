# ASIT English Tutor — v0.3.0 candidate (skills-only)

Two new lazy instruction skills: `asit-core` (subject-neutral learning/selection) and `asit-english` (English objectives, rubric, CEFR). The existing eight skills continue to own routing, lesson UI, grading, Save Gate, media, voice and onboarding.

The optimized critical path prepares one trusted lesson blueprint and reuses current-turn provider-verified facts. Safe ID checks, writes and readbacks are grouped when available; dependent projection writes remain separate. Incorrect-choice feedback is now consistently non-spoiling. No features, permissions or verification gates are removed.

No MCP/backend, executing plugin JavaScript, bundled audio player or guaranteed native UI hook. Optional Google Sheets schema v2 remains unchanged, with consent, Activity pre-registration and readback. Source commits/static tests do not publish the plugin or prove live learner behavior.

See `docs/ARCHITECTURE.md` in the repository and the existing acceptance test documents.
