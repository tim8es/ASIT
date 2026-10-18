---
name: asit-exercises
description: "Build task-appropriate native ASIT UI from the canonical contract; load only the matching pattern reference."
---

# ASIT exercises — selective UI builder (v0.3.10)

For **structured interactive tasks** read the authoritative [UI contract](references/ui-contract.md) and choose an appropriate [UI family](references/ui-families.md). Read **only** the relevant detailed recognition, construction, media-interaction or game reference, when necessary. The lengthy [visual exemplar](references/complete-native-lesson.md) is a troubleshooting/copy-adapt example **only for matching complex five-task visual-discovery forms**; never load it unconditionally, nor copy its scene or answers as a lesson. For a simple correction or conversation, do not build a full DIL form.

- Select actual cognitive operation and modality **before** choosing the control. Preserve learner task-count/time settings; default five tasks/~7 minutes only for an otherwise unconfigured full lesson.
- Use supported native controlled inputs, visible meaningful state changes, accessible labels and keyboard operation. Cards/All and Previous/Next must retain responses. For finite answers provide accurate, non-spoiling provisional feedback only after input; natural responses are reviewed after Submit.
- Each graded task has a frozen ID and rubric. For consented storage, `asit-lessons` must receive verified per-task Activity pre-registration/readback before displaying any scored controls. Failure blocks SAVE-REQUIRED until an explicit offline choice; do not hide it behind a generic unsaved label.
- Submit once via `GenUI.issueNewTurn` with the unchanged `ASIT_ATTEMPT_V2` answer map. A chat event is not a Sheets save. Client first-try metadata is unverified.
- Image tasks need verified image evidence, symbolic SVG is `visual_symbols`, genuine listening needs audio plus hearing confirmation, speaking needs Voice. If a modality fails after display, mark it `not_assessed` and do not fake evidence.

No bundled client executor, background persistence, simulated player or guaranteed rendering is installed.
