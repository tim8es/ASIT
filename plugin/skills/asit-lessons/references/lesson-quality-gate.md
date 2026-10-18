# ASIT lesson acceptance — v0.3.8

**Single UI normative source:** [UI contract](../../asit-exercises/references/ui-contract.md); [UI family chooser](../../asit-exercises/references/ui-families.md). Additionally require [Creative Quality Gate](../../asit-creative-director/references/creative-quality-gate.md) for all complete lessons, without overriding any educational, modality, accessibility or Save Gate rules. Use before Activity registration and before rendering. No model-written checklist proves a client render.

## Verify pedagogical inventory

- One learner-relevant can-do, factual current preference and duration, authentic communication situation and credible rubric for each graded task.
- Default with no user choice: ~7 minutes and 5 graded tasks. Five-task default: ≥3 distinct cognitive operations, ≤2 simple single-choice recognitions, no three consecutive clones, at least one fresh-context transfer. Long lessons need phases matched to stated time; don't inflate by repeated cloze.
- Choose visual_discovery, communication_mission, reading_reasoning, listening_lab, focused_drill or dialogue_voice based on *actual learning operation*. Reject gratuitous SVG, fake games or irrelevant cover. If subject is spatial/visual, images/diagrams must be required for actual answers, not decorating text questions.
- Creative direction: a useful real-world outcome, one cohesive visual/editorial language, meaningful response to user action, no stock-image montage and no repeated near-identical questionnaire disguised with new icons. When no image is pedagogically necessary, a refined text-first layout is acceptable. Reject narrative monotony on full lessons.
- Verified image source necessary for photograph-scored task. SVG state manipulation is `visual_symbols`, not photographic image or animation. For listening, original bounded authenticated source + questions + learner hearing report; transcription alone = reading. No silent modality substitution; adjust rubric/Activity before preregistration.
- No copyable independent-task answers in hints, labels, nearby captions, placeholder, chunks or feedback. Incorrect finite answers only show neutral `Incorrect — Try again`; semantic feedback after Submit.

## Verify output before displaying

- Native controls from checked template; exact option-value domain and correct answer comparison; changes visible only after a real click; no nonworking buttons; Cards↔All retains responses; Undo/Replay preserves unrelated answers and first-try metadata.
- One canonical Submit event and early incomplete Submit with explicit count confirmation; separate registered IDs per graded operation; actual consented pre-registration/readback or truthful UNSAVED notice.
- Screen controls readable and pointer/keyboard usable; don't assume mobile, media player or animation works from source code.
- Editorial gate: all five rubric areas reviewed, no hard stop. A numerical self-score is not user-experience proof; conduct host dogfooding before claiming production readiness.

If any requirement fails, **redesign before registration**. Broken post-render media → `not_assessed`. Developer suite may lint static templates but cannot guarantee live ChatGPT behavior. Run a separate desktop and mobile acceptance before claiming release quality.
