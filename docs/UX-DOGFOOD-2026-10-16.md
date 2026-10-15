# ASIT native UI dogfooding — 2026-10-16

This is a **source-and-reference-code review** after an in-chat 15-pattern showcase, not a completed in-client usability study. Real learner data was not used. A passing CI test does not prove native ChatGPT controls work on every web/mobile client.

## Catalog and counted scope

`ui/patterns.json` v0.5 lists **18 unique patterns: 17 assessment/practice formats + 1 `progress_explorer` read-only evidence view**. New in this revision:
- `reading_comprehension`: real readable passage → gist and textual evidence prompts. This is reading, never audio listening.
- `timeline_ordering`: actual clickable event cards → Undo/Reset → a follow-up independent explanation using before/after.
- `image_hotspot`: click/keyboard-select genuine regions of a real image, **only** with verified usable region controls. If absent, switch to `image_choice` or text-only recognition with changed evidence label.

Core tasks remain `cloze`, `sentence_builder`, `image_label`, `grammar_contrast`, `error_detective`, `vocabulary_retrieval`, `free_production`, `dialogue`, `listening`, `scenario`, `matching`, `card_ordering`, `image_choice`, `spoken_response`.

## Heuristic UX failures and remediations

| Observation | Remediation | Verification |
| --- | --- | --- |
| An inline term trigger broke one narrative sentence into three blocks | Preserve the full sentence and place the popover after it if native inline mode breaks wrapping | Manual browser/mobile typography check |
| Story finale played despite missing final required free-writing response | Trusted 4/5 coverage = incomplete; `not_assessed` writing; block full finale; explicit early incomplete exit | `summarizeLessonCompletion` tests |
| User revised objective choice after visible feedback, risk of false independent success | Track first response, revisions and hints as **untrusted UI provenance**; verify against trusted rubric after one Submit | `summarizePracticeProvenance` tests |
| One static message pretended to measure sustained conversation | Require two actual responsive turns; static response is preparation only | `summarizeDialogueTurns` tests + manual chat |
| Sentence builder and word-order builder looked equivalent | Semantic chunks versus individual word cards; distinct scaffolding labels, Undo and guided-versus-independent evidence | Manual side-by-side screenshot/interaction |
| Audio boxes displayed without any playable recording | Gate listening/speaking on *actual available* source and capture, not illustrative waveforms; mark unsupported modality unassessed | Manual real-audio playback/recording acceptance |
| Hotspot in a single image was only a static illustration | Gate on both a real image and real pointer/keyboard region controls; use image-choice fallback if unavailable | Manual pointer/keyboard checks |

## Native UX component contracts

**Every task:** index, learning operation, one clear instruction, visible accessible response state, non-spoiler hint, keyboard-friendly recovery, explicit modality. Preserve attempts while moving across chapters. For deterministic answers, provisional immediate right/try-again only when the trusted rubric is unambiguous; plausible free responses wait for teacher feedback.

**One lesson:** normal planned packet remains learner-configured (default ~7 minutes and four tasks); a full 18-pattern showcase is a long **QA mode**, not a standard lesson. One final verified Submit and consent-first external storage. Unanswered required tasks block completed status; early exit explicitly incomplete. No local widget can persist a learner record.

**Progress explorer:** always derives from verified private source evidence; expose independent versus assisted observations separately, limitations, due reviews, and unassessed modalities. Raw entry count is not CEFR level, mastery score or reliable fluency metric.

**Accessible fallback:** popover may be after a complete sentence; click-to-order works without drag; text-only image fallback changes modality; a textual transcription is not audio; animated timeline has a plain-text ordered alternative. Do not render decorative but inert play/record controls.

## Prioritized roadmap (not falsely claimed implemented)

P0: Verify native web/mobile rendering of 18 patterns; real audio asset + real learner recording + permission workflow. Existing reference source cannot itself install a microphone or a media player.

P0: End-to-end capture and server-side validation of actual first tries, hint and revision metadata through `ASIT_ATTEMPT_V2`. Local metadata cannot be authoritative.

P1: A robust real multi-turn interactive dialogue flow, continuing over real ChatGPT turns; structured assessment and session checkpoint. Do not collapse this into a fabricated single-form interaction.

P1: Author and test high-quality accessible picture hotspot regions on a client that actually supports them; use the fallback meanwhile.

P2: Consider `spot_the_difference` for genuine contrasting-scene language production; consider `pronunciation_shadowing` only after reference playback and learner audio access work. Neither is in the 18-type catalog.

## Live acceptance checklist (unverified until performed on actual clients)

- [ ] Web: each image-based exercise shows the intended image and appropriate alt/fallback.
- [ ] Mobile: inline term hints do not split a narrative sentence.
- [ ] Keyboard: timeline, word cards and hotspots are operable, focus visible, Undo/Reset work.
- [ ] A choice change shows the correct provisional status; the first-response record survives a retry.
- [ ] Missing required final writing blocks full completion; incomplete exit remains explicit, not a "win".
- [ ] Reading passage yields gist/detail responses without an audio modality claim.
- [ ] Hotspot uses actual interactive regions; absent feature visibly falls back without scoring a phantom click.
- [ ] Dialogue reacts meaningfully to at least two actual learner messages.
- [ ] Real source audio plays (when configured), and genuine learner recording is accessible to assess; otherwise unavailable is honest.
- [ ] Submit is a real new turn and persistent saving is verified separately when explicitly consented.
