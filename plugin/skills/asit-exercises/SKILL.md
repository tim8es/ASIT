---
name: asit-exercises
description: "Builds verified native interactive ASIT practice and full-lesson UI from a canonical UI contract and fixed pattern families, with truthful modality-specific assessment."
---

# ASIT exercises — native UI orchestrator v0.3.6

**Mandatory for any structured UI:** read [single UI authority](references/ui-contract.md), then [vetted UI families](references/ui-families.md); read only the matching detailed reference (recognition, construction, media-interaction or game-patterns). The [complete five-task template](references/complete-native-lesson.md) defines the default multi-card form mechanics, not a compulsory parcel story or SVG game for every lesson. The full task catalog remains [17 graded types + read-only progress explorer](references/pattern-registry.md).

1. From `asit-core`/English objective choose observable cognitive operation, response type and real modality before selecting UI. Prefer high-quality real interactivity; plain conversation for live dialogue and small corrections is legitimate.
2. For complete lessons, honor learner count/duration and use default 5 graded tasks/~7 minutes only if no preference exists. For 5 tasks aim for ≥3 distinct operations, ≤2 simple finite recognitions, a meaningful fresh-context transfer and one canonical Submit.
3. Use native controlled state: real change on each button, retained answers/first-try markers under Cards/All, appropriate Undo/Replay, a genuine incomplete-confirmation path. Finite answers show local feedback after interaction with exact correct value mapping; natural answers wait for semantic assessment.
4. Maintain answer integrity: no hint or key before attempt or after wrong finite choice; no copyable independent prompt. Client feedback/first tries are provisional and unverified, not saved evidence.
5. Source images must be tool-verified, image-labelled tasks must use image evidence. SVG diagrams are `visual_symbols` only. Listening needs verified actual audio and hearing report; Voice genuine client session; no fake media player/hotspot/animation.
6. Each subtask has a trusted rubric/Activity ID fixed before display; consented Save Gate is owned by `asit-lessons` and `asit-assessment`. One final Submit issues `ASIT_ATTEMPT_V2` with bounded answer map. Use truthful fallback and `not_assessed` if any modality cannot execute.

Do not load all references for a quick exercise. The component source examples are **not runtime modules**: they instruct the model how to author native widgets and require host QA.
