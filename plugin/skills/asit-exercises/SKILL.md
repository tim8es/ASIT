---
name: asit-exercises
description: "Use when ASIT needs an interactive English practice card, native UI lesson, specific grammar/vocabulary trainer, picture-to-word input, cloze, word matching, sentence builder, reading check, image hotspot, timeline, card ordering, or a learner-selected exercise type."
---

# ASIT exercise and native UI orchestrator

Choose the interface by the learner's **operation and actual observable modality**, then by available client capabilities, then by useful variety. Do not use a widget merely for decoration; plain conversation is valid. Choose one or several of the 18 catalog entries in [pattern registry](references/pattern-registry.md): **17 practice types plus 1 read-only progress explorer**.

## Rendering and evidence rules

1. Know target competency, task prompt, correct rubric with accepted alternatives, required fields, operation, modality and hint policy **before** presenting an exercise.
2. Prefer ChatGPT-native controls for selection, text, ordering, feedback and a single Submit when supported; make all visible controls actually respond. If platform controls are unavailable, use an accessible numbered/text fallback **and describe changed modality**. Do not fabricate drag, clicks on images, Play, Record, unseen text or saved history.
3. For 3+ related practice exercises, select 2+ complementary formats where pedagogically justified; planned lessons use `asit-lessons` order and duration rules.
4. Deterministic choices, clozes with unambiguous accepted forms, and completed word orders **must** show provisional local `Correct` / `Try again` plus brief explanation/clue after interaction when native state supports it. Never show the key before an attempt. Retain first try separately from current answer, revision count and hint exposure as untrusted provisional metadata. Free writing, ambiguous answers and plausible unlisted synonyms receive `Review after Submit`, not invented immediate grading.
5. A real form has **one final Submit** that posts a new ChatGPT turn. Required blanks block ordinary completion; the user may deliberately finish incomplete. Local states are not saved records. The teacher re-checks answers from trusted rubric after Submit using `asit-assessment`.
6. Preserve narrative text as full sentences; don't split a sentence into multiple blocks just to insert a popover. Only show clickable underlined explanation when it is actually a working control.

## Specialized gates

**Pictures.** `image_label` requires an actual suitable image placed immediately above the typed response input, without text revealing the answer in an image caption. Confirm normal synonyms and short phrase aliases. Image-only fallback becomes honestly **text-prompted recall** if media fails. `image_hotspot` requires truly actionable semantic regions with keyboard and pointer access, stable region IDs and a visible selected state; a static photograph is not a hotspot.

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
