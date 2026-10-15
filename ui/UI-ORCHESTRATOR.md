# UI Orchestrator — compact runtime contract (v0.1)

**Purpose:** choose meaningful ChatGPT-native practice UI, not generate learner content, grades or persist answers. Universal and learner-neutral. The pure selector `src/ui-orchestrator.mjs` is a deterministic reference; ChatGPT does not automatically execute it.

## Minimal runtime decision (read this, not the entire pattern library)
1. **Mode:** free conversation or tiny direct request → plain chat/text, no forced form. Lesson or diagnosis → select an activity.
2. **Evidence action:** decide whether learner should **recall, recognize, construct, explain or apply**. Record required modality (typed/reading/real speech/real listening) and operation (production/interaction/recognition/comprehension).
3. **Pattern:** inspect the compact index in `src/ui-orchestrator.mjs` or `ui/patterns.json`; pick the highest evidence fit supported by this client's native capabilities. Recent repetitions incur a penalty; novelty never outranks modality or valid assessment.
4. **Lazy details:** load **only the selected** `ui/patterns/<name>.md` recipe(s). Do not load all recipes or invent missing components. Ground images and audio in real media; otherwise select a labelled alternative.
5. **Render:** in one response provide topic → grammar/language-use rule → learner-configured tasks → vocabulary recap at end → **one Submit**. Default to a 7-minute, up-to-5-task lesson; use private Learner State overrides for duration and exercise count, scaling task density to the chosen time. An explicit one-session override does not rewrite the saved settings. Respect accessible alternatives. If multiple skills/modalities are assessed, use separately trusted Activities; only use a combined answer within one Activity when rubrics and evidence scope match.
6. **Feedback:** after the combined Submit, explain communicated success, fix 1–2 important errors and give a short next transfer/review recommendation. In diagnosis, at most one remedial retry before sampling something else. No unconditional loop.

## Capability and fidelity gates
- Missing `audio`: mark spoken or listening proficiency **unassessed**; a typed fallback provides typed evidence only.
- Missing `image`: no picture-based test; never invent an image or infer visual comprehension.
- Missing usable `ordering` drag: use numbered selectable/text ordering; keep equivalent task semantics.
- Avoid inert controls and meaningless illustrations. A visual surface is never proof of skill by itself.
- Honour learner privacy: learner records remain in private state, **not here or on GitHub**.
- For native UI submissions follow `ui/activity-contract.md`, `prompts/submission.md` and `install/ASIT-STORAGE.md` only when necessary.

## Compact quality gates
Selected activity must have (a) the right observed operation/modality, (b) one necessary learner action, (c) valid rubric and alternate correct answers, (d) reachable accessible input, (e) a response-specific hint/feedback/retry path, and (f) no leaked model answer before submission.

Use `ui/patterns.json` as the pattern overview; lazy Markdown recipes below are normative render/fallback instructions.
