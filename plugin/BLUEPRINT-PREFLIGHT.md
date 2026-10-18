# ASIT lesson preflight and E2E acceptance (developer workflow)

This is an **offline validation aid** and a manual release process. The installed ASIT 0.3.2 is **skills-only**; none of the Python files in `plugin/scripts` are executed by the ChatGPT model or by a Submit hook. A green static check cannot prove an image reached the user's client, that audio played, or that learning improved.

## Offline blueprint CLI

```bash
python3 plugin/scripts/lesson_contract.py plugin/tests/fixtures/valid_visual_lesson.json
python3 -m unittest discover -s plugin/tests -p 'test_*.py'
python3 plugin/scripts/package.py --check
```

The fixture is **synthetic** and contains an intentionally fictional but correctly shaped image result ref; it is not a source of actual lesson imagery or a production learner rubric. The validator returns nonzero for: photo operations with missing/unverified media declaration, malformed ref formats, missing render/fallback assertion, answer leakage, incorrect task mix, duplicated IDs, fake input controls, missing canonical Submit, unsupported "independent" labels and invented skip reasons. Tests add negative cases for a 30-radio lesson and guided outcomes mislabeled independent.

A declared `verification=tool_verified_in_this_turn` is an assertion supplied by the calling workflow, **not** authenticated proof. To release an actual lesson, the tutor must inspect **real successful image-tool output in the current conversation** and use the exact returned asset. Even a genuine ref does not prove client rendering.

## Skills-only online preflight (must happen BEFORE storing Activity IDs)

1. Resolve current learner goal, modality preference and constraints; check recent independent outcomes, **not** blanks as incorrect answers.
2. Verify external media and exact source refs; confirm relevant scene and no answer-leaking alt/caption/vocabulary. If unverified, redesign as a correctly labelled text/visual-symbol task. Do not quietly write photo Activity IDs.
3. Freeze a single task inventory and semantic rubric; verify 5-task 7-minute operation mix or genuine multi-phase 20+/40-minute structure.
4. Verify stateful UI mechanics for requested mini-games: a prediction input, actual changing scene/assignment state, visible feedback **after** an action, reversible controls and a different-context transfer.
5. Only then do Google Sheets Save Gate Activity preregistration and readback, with verified current consent and revision. Later answer submissions use exact-ID dedupe and Attempt + projection readbacks. A local badge does not mean saving.
6. After a learner reports an invisible/broken image, treat the affected visual task as **not_assessed** without retroactively editing the original Activity; do not award fake image or listening evidence.

## Runnable mini-game prototype

Open [Parcel Mission](prototypes/parcel-mission.html) in a local browser. It uses native HTML radio controls, a real Move/Replay state, CSS transform **animation** plus `prefers-reduced-motion`, after-action verdict and a distinct ungraded English transfer question. Keyboard controls and aria-live feedback are included. This file is a **standalone developer prototype**, not bundled in the installed Skills-only plugin; it neither invokes a real ASIT Submit nor writes to Google Sheets. Its static source contract has unit tests, but mobile/browser E2E remains manual.

## Manual desktop/mobile regression matrix

| Scenario | Pass | Reject |
|---|---|---|
| Real photographed visual lesson | Each actual returned image visibly loads next to the question; two questions genuinely require scene details | Syntactically plausible unsourced image ref, missing image rendered, key in alt |
| No image API result | Exact *text/diagram* replacement rubric preregistered instead | Image-scored Attempt despite no actual picture |
| Interactive Parcel Mission | Prediction, Move control, **visible SVG state change**, feedback, Replay and independent transfer all function | Static emoji, inert button, state change called smooth animation |
| True CSS motion optional | Host/mobile tested transition and reduced-motion fallback | SVG coordinate snap advertised as animation |
| Skipped writing by choice | Mark not_assessed; format rotates; no imposed "low level" | Incorrect/needs_support, cloned long textarea every lesson |
| Competency projections | Reading inference mapped to comprehension; guided chunks remain supported; valid independently written interaction separate | Exact-string alias mismatch or guided proof treated as independent |
| Replayed Submit | No duplicate Attempt or new successor | Blind append or second unrelated lesson |
| Real ELLLO playback | Exact source, bounded clip, heard/transcript self-report, appropriate grading | Footer URL only, transcript scored as listening |
| CEFR dashboard | Exact task-mapped official descriptor + sufficient distinct independent evidence, separate dimensions | Level inferred from 1 radio or from unassessed speaking/listening |
| 7-min and 40-min UX | Cards/All, early finish, readable controls, enough meaningful operations and correct duration planning | Repetition of same five mechanics or fake timer |

For *each* client (desktop web, mobile) test with a real learner and explicit consent; archive **privacy-safe** observations only. Record actual page, device, source ref provenance and confirmed UI behavior. Do not commit real learner answers or private workbook identifiers.

## Acceptance measurements for instructional progress

- Diagnostic unaided can-do score by dimension, **separate from game-completion rate**.
- Immediate performance, after-help performance and **delayed** same-can-do performance 2–7 days later.
- Fresh-context unaided transfer; preserve first response vs revised/assisted evidence only when reliable.
- Format completion and skips as **engagement signals**, not proficiency errors; reason remains unknown unless stated.
- Source-verified media success rate and task completion on desktop/mobile. Use actual samples before claiming improved educational effectiveness.

## Release topology (October 2026)

Main repository v0.3.0 is behind installed private plugin v0.3.2. PR #26 aligns the deployed skills to v0.3.2; subsequent linked regression work is stacked on its branch. Merge/deploy/reinstall are separate operations. **This PR does not update the installed plugin**. No claims of better learner outcomes without measured trials.

Related: #27 media, #28 evidence mapping, #29 skip/format, #30 games, #31 executable QA.
