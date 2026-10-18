# ASIT English Tutor — v0.3.5 candidate (skills-only)

Two new lazy instruction skills: `asit-core` (subject-neutral learning/selection) and `asit-english` (English objectives, rubric, CEFR). The existing eight skills continue to own routing, lesson UI, grading, Save Gate, media, voice and onboarding.

The optimized critical path prepares one trusted lesson blueprint and reuses current-turn provider-verified facts. Safe ID checks, writes and readbacks are grouped when available; dependent projection writes remain separate. Incorrect-choice feedback is now consistently non-spoiling. No features, permissions or verification gates are removed.

No MCP/backend, executing plugin JavaScript, bundled audio player or guaranteed native UI hook. Optional Google Sheets schema v2 remains unchanged, with consent, Activity pre-registration and readback. Source commits/static tests do not publish the plugin or prove live learner behavior.

See `docs/ARCHITECTURE.md` in the repository and the existing acceptance test documents.

## v0.3.5 candidate review

The source adds conservative independent-evidence gates, explicit media source/fallback policies, non-punitive skipped-writing adaptation, a responsive standalone game prototype, and executable offline blueprint checks. This is **not** the installed 0.3.2 release and has not been end-to-end validated in ChatGPT. The prototype is excluded from the skills-only distributed package. See `BLUEPRINT-PREFLIGHT.md` and PR #32.

## v0.3.5 rich-by-default lesson UX (private dogfood candidate)

For **any complete lesson or auto-continuation**, the primary dispatcher loads [rich-default-lesson](skills/asit-lessons/references/rich-default-lesson.md), then the [complete native DIL lesson](skills/asit-exercises/references/complete-native-lesson.md) reference. The default is five diverse assessed activities, a visible scene with real learner-triggered state change and immediate deterministic feedback, answer retention across Cards/All and one Submit. If no verifiable image ref exists, use a **genuinely drawn SVG visual-symbol scene** with reclassified rubrics; never fabricate photographed evidence or silently return a plain-text quiz. Authentic photos/audio and motion remain capability-dependent. See tests and README source for limits. The Python linter is development-only and does not run as a tool when ASIT creates a live lesson.

This v0.3.5 code is a **test candidate** until manually dogfooded and the private plugin updated. PR #32 is a prerequisite for repository history; deployment is a separate Plugin Creator operation.

### Revision in v0.3.5

Conservative `visual_symbols` competency evidence now recognizes genuinely displayed SVG prediction/tracking/label tasks as *supported-only* practice (never independent language mastery), while unverified diagram visibility excludes the attempt from that claim. Added regressions for every new operation family.
