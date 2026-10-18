---
name: asit-exercises
description: "Use when ASIT needs an interactive English practice card, native UI lesson, specific grammar/vocabulary trainer, picture-to-word input, cloze, word matching, sentence builder, reading check, image hotspot, timeline, card ordering, or a learner-selected exercise type."
---

# ASIT exercise and native UI orchestrator

Choose the interface by the learner's **operation and actual observable modality**, then by available client capabilities, then by useful variety. Do not use a widget merely for decoration; plain conversation is valid. Choose one or several of the 18 catalog entries in [pattern registry](references/pattern-registry.md): **17 practice types plus 1 read-only progress explorer**.

## Rendering and evidence rules

1. Know target competency, task prompt, correct rubric with accepted alternatives, required fields, operation, modality and hint policy **before** presenting an exercise.
2. Prefer ChatGPT-native controls for selection, text, ordering, feedback and a single Submit when supported; make all visible controls actually respond. If platform controls are unavailable, use an accessible numbered/text fallback **and describe changed modality**. Do not fabricate drag, clicks on images, Play, Record, unseen text or saved history.
3. For a full four-task lesson, prefer 3 distinct cognitive operations, not just cosmetic control variety. After repeated errors, rotate to error_detective, image_choice/image_label, scenario or construction; see [experience planner](../asit-lessons/references/experience-planner.md). The learner may explicitly choose a fixed drill format.
4. Deterministic choices, clozes with unambiguous accepted forms, and completed word orders **must** show provisional local `Correct` / `Try again` after interaction when native state supports it. After a wrong response give a neutral Incorrect / Try again verdict **without a directional clue** or answer elimination. After a correct response explain briefly only when it cannot reveal a later task's answer, as required by answer-integrity. Never show the key before an attempt. Retain first try separately from current answer, revision count and hint exposure as untrusted provisional metadata. Free writing, ambiguous answers and plausible unlisted synonyms receive `Review after Submit`, not invented immediate grading.
5. A real form has **one final Submit** that posts a new ChatGPT turn. Required blanks block ordinary completion; the user may deliberately finish incomplete. Local states are not saved records. The teacher re-checks answers from trusted rubric after Submit using `asit-assessment`.
6. Preserve narrative text as full sentences; don't split a sentence into multiple blocks just to insert a popover. Only show clickable underlined explanation when it is actually a working control.

## Default full-lesson native interaction

A full lesson always needs functioning native UI, even when the learner simply says "continue"; it is NOT an optional request for a game. Read [complete five-task DIL example](references/complete-native-lesson.md) before rendering and follow [mandatory rich default](../asit-lessons/references/rich-default-lesson.md). At least one diagram/scene must respond to a native button and display changed state. If real image tool refs cannot be verified, a native SVG scene remains useful but is scored as `visual_symbols`, **not** a photographic assessment. The independent source-based image slot is optional and must never be invented. Do not claim the separate HTML/CSS prototype can execute in ChatGPT.

## Stateful micro-games (when requested or instructionally useful)

Use [game patterns](references/game-patterns.md), not a new simulated executor. Build meaningful predict → manipulate → feedback → transfer cycles with real `DIL.useState`-controlled native buttons/selectors and observable changed positions, assignments or consequences. A native SVG state change is a diagram, not a retrieved photo and not proof of smooth CSS animation. A sourced `AsyncImage` requires [media provenance](../asit-lessons/references/media-provenance.md) before a graded image operation. Include 2+ different cognitive actions, an accessible non-pointer alternative and the **same** canonical final Submit; no local game "win" is a saved Attempt. Repeated skipped text inputs call for alternate mechanics, not lower assumed ability.

## Specialized gates

**Pictures.** A pictured task must actually depend on visual evidence: a cover photograph alone is decoration. `image_label` requires an actual suitable image placed immediately above the typed response input, without text revealing the answer in an image caption. Confirm normal synonyms and short phrase aliases. Image-only fallback becomes honestly **text-prompted recall** if media fails. `image_hotspot` requires truly actionable semantic regions with keyboard and pointer access, stable region IDs and a visible selected state; a static photograph is not a hotspot.

**Ordering.** `sentence_builder` arranges **meaningful multiword chunks**; `card_ordering` orders **individual tokens**; `timeline_ordering` orders grounded before/after story events. Use click-to-order, Undo/Reset and keyboard alternative when available. Do not rigidly grade ambiguous chronological ties.

**Reading.** `reading_comprehension` shows an actually available continuous text and separate gist/detail prompts. Reading is never evidence of listening.

**Audio/video and speaking.** An ordinary native select/input widget cannot play arbitrary sound or start Voice. Use `asit-media` for verified source recordings, `asit-voice` for live speech; otherwise mark the requested modality `not_assessed`.

**Interaction.** `dialogue` requires real multi-turn responsive chat, not one static textarea.

**Progress explorer.** This is a read-only view of actually verified learner state; no fake percentages, no grading and no Submit required. Use `asit-progress`.

## Visual, feedback and responsiveness

For structured exercises load [visual + live feedback contract](references/visual-feedback.md) **only when rendering the UI**, not on routing, progress lookup, small vocabulary questions or pure chat. Prefer a relevant cover/scene/timeline for a full lesson when reliable and useful; never search media solely as decoration or claim motion/audio without an actual supported component. Form controls must visibly react and remain keyboard-friendly; one real Submit, no inert buttons.

## Detailed patterns

Open only matching pattern instructions rather than the entire catalog:
- [Recall, recognition, reading and pictures](references/recognition.md)
- [Construction, ordering and independent use](references/construction.md)
- [Dialogue, Voice and media interactions](references/media-interaction.md)
