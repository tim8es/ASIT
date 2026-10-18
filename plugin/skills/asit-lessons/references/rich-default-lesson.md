# ASIT default rich-lesson contract — mandatory for EVERY full lesson (candidate v0.3.4)

**Status:** normative **model-followed** release gate, NOT a running lesson compiler or guaranteed host renderer. Read from `asit-teacher` before any lesson generation and from `asit-assessment` before any automatic successor. Applies to plain "Продолжим", "Start ASIT", "Teach me", post-submit continuation and long lessons **without any user request for games/images**. A learner's explicit text-only, accessibility or bandwidth instruction overrides visuals.

## Rule 0: do not deliver an all-text lesson as the automatic fallback

The correct default is **visually meaningful, stateful, interactive, communicative**, not text-first. Source media is a *production decision*, never a prerequisite to having a good visual lesson.

1. If genuine photos/illustrations are suitable, request or retrieve an actual source **before** freezing any image-dependent Activities. Verify exact returned tool ref, visual content, answer integrity and suitable rendition. Never invent a `turn...image...` ref or assert actual client display without evidence.
2. If source verification fails, **switch to a self-contained, clearly labelled SVG/diagram scene and native clickable controls**. Change photo/real-image operations to `visual_symbolic_spatial_prediction`, `diagram_object_tracking`, `diagram_scene_comparison`, etc.; reflect this in the rubric and `visual_symbols` modality. A labeled diagram is not an authentic photo, so never claim `image_label`/real-photo recognition.
3. If the client is known not to support functional native controls, show honest failure/capability note and the strongest available structured interactive text alternative; **do not pretend a quiz, image, animation or button worked**. This exception is an observable runtime limitation, not the default no-photo path.
4. A `16:9` **visual cover** is strongly preferred when source is verified; a well-rendered scene diagram in Q1/Q3 satisfies visually meaningful fallback, but does NOT constitute a real photo cover. Never display an empty `AsyncImage`.
5. Avoid using image-generation or image-search requests with no chance of reliable asset delivery merely to meet a quota; prefer a diagram if the visual concept is spatial, relational, temporal or process-based.

## Default micro-lesson format: 6–9 minutes, FIVE graded tasks

**One observable CEFR-aligned can-do, one coherent situation with real communicative stakes, a narrative outcome that changes as the learner acts.** Within 7 minutes:

| Step | Required learner action | Evidence / UI | Teaching function |
|---|---|---|---|
| 1 · Notice/predict | See a **grounded real image OR self-contained SVG scene** and commit to a plausible prediction before anything moves | controlled radio/segmented-control; first selection unverified | attention, noticing |
| 2 · Retrieve/compare | Locate/describe/compare a **different detail** of the same evolving scene, not re-answer step 1 | picture-to-word short input OR two independent scene-card assignments | retrieval without copying |
| 3 · Manipulate/observe | Tap a **working** Move / Reveal / Change / Replay action that visibly mutates the object/scene/assignment and produces **after-action** feedback; avoid revealing target solution before prediction | DIL-controlled state + SVG scene, selector, ordered cards or real matching | discovery and self-correction |
| 4 · Decide/repair | Meaningful communicative decision, error repair or sentence construction; selection has a concrete consequence for the story | actual selected-state UI, Undo/Reset when ordering | task-based practice |
| 5 · Transfer | Apply the linguistic goal in a fresh context to a real recipient; **3–8 word independent response may be voluntary** when writing was intentionally skipped previously | native text input/textarea with `Review after Submit`; omission = `not_assessed` | generalization |

For a 5-task lesson **require** ≥3 distinct assessed operations, ≥3 working response controls and ≤2 pure multiple choice; at least one **stateful visual interaction** independent of the prompt's explicit wording. Distinguish 5 *graded activities* from extra zero-grade UI interactions within an Activity (e.g. Move + Replay). Do not count a decorative image, a static CSS preview, progress badge, progress bar or emoji as an assessed visual interaction. A plain text Q1 and a text Q3 do not satisfy fallback.

**Mandatory first-screen structure** (keep brief):
- situational title + can-do and learning purpose;
- 1–2-line situation with a character, goal and stakes;
- visual scene **in first exercise**, with a caption stating `diagram` if symbolic;
- ≤5 relevant vocabulary items, but withhold **target labels/solutions** until after corresponding image-label/prediction steps;
- Cards/All selector and progress indicator when genuinely working;
- native controls adjacent to source material (not a blank placeholder);
- brief helpful feedback **after** each deterministic learner action, without spoiling another independent task;
- one canonical Submit at end with early incomplete Submit, and a single new ChatGPT turn carrying subtask IDs.

## Core interactions are not optional extras

Any planned full lesson MUST generate at least one complete self-contained interactive block with:
- real controlled state `DIL.useState` declared once unconditionally in top-level `{@body ...}`;
- named real callbacks for Move/Replay/Undo and selections; no inert pressables;
- observable state-dependent UI changes and semantic outcomes, not just a disabled button;
- no `onClick` handlers on `svg` primitives, `AsyncImage` or generic text;
- provisional deterministic feedback only after the user interacted; free text `Review after Submit`;
- preserved answers when switching Cards/All and on task navigation;
- no fake timer, recorder, draggable hotspot, CSS transition, simulated ELLLO audio or fabricated external refs;
- **one** real `GenUI.issueNewTurn("ASIT_ATTEMPT_V2\n"+JSON.stringify(envelope))` on actual Submit, with a stable ID for each graded item, `skipped_task_ids` for blanks, no answer loss and no false persistence claim.

See [copy-adaptable native lesson template](../../asit-exercises/references/complete-native-lesson.md). The template is code guidance **for model rendering**, not a downloadable widget or automatic host extension. When the user reports broken UI, the model must not grade an invisible picture or assume the template was rendered.

## Pedagogical gate: learning, not decoration

- Select can-do from verified goals, recent failed independent attempts and due review while respecting learner-set duration. Do not force an increase in skill difficulty from repeated correct choices or punish deliberately omitted text answers.
- Choose ONE language target + 1–2 prerequisites. Provide situation and comprehension input before elicitation. Aim at attainable challenge, not a new grammar list.
- First expose enough scene *evidence* to solve, not the answer. Use noticing → prediction → manipulation/feedback → application; no model sentence that can be copied as the "independent" transfer response.
- At wrong response give neutral `Incorrect — Try again` first, optional concise conceptual explanation after the learner's own revision or at grading; no answer elimination as a clue.
- Record actual rubric, response format, operation, support level and modality separately. A simulated scene tests **visual symbols**, not real photograph recognition. Guided task ≠ independent CEFR evidence.
- Include explicit *due review* when appropriate, without repetitive drills. In longer lessons use 4–6 distinct phases and validated authentic listening **when truly available**.

## Release gate — FAIL AND REDESIGN before Activity registration or rendering

Reject any of the following for a normal full lesson, no matter how polished the prose:

- only prose/Markdown quiz, all five prompts merely text, or no functioning native input/Submit;
- zero source-grounded photographed or diagrammed scene in the graded learner work;
- visual cover alone, icons alone, decorative images, hallucinated image refs, inert fake animation;
- no real state mutation, no visible action consequence, no feedback after deterministic input;
- five cloned radios/clozes, forced long textarea despite intentional skipped writing, or independent task answer copyable from earlier visible text;
- the rubric or stored `Activity` claims `image_choice` or `listening` while only a diagram or transcript was shown;
- a claimed first-try/CEFR upgrade from unverified client UI state;
- failure to read back preregistered consented Activities or an unsaved lesson falsely labelled as saved.

Before rendering, privately construct a table `task_id | can_do | operation | control | source_ref_or_diagram | state_transition | feedback_after_action | rubric | modality`. Manually recheck the rendered **actual UI**, not only the plan. If a planned control is impossible, revise plan and Activities first, or mark a post-render broken item `not_assessed`. Never claim testing that wasn't performed.

## Minimal control checklist

`scenario_goal` grounded? `Q1` scene visible? `Q2` actual retrieval? `Q3` Move/Replay works? `Q4` language action matters? `Q5` fresh transfer not copyable? deterministic feedback after input? >=3 operations? >=3 working response types? one canonical Submit? proper `not_assessed` skips? no invented images, audio, animation or saving? **Any "no" means the full lesson is NOT ready.**
