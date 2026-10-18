# ASIT rotating scenario bank — concrete pedagogical mechanics (v0.3.4)

**Load on every full lesson after the rich-default contract, but only this small reference; do not copy it wholesale into the learner reply.** This is a planner catalogue, not media assets or an executing JS program. Adapt scenario to verified learner can-do, prior errors, due reviews, available media, user request and 6–9-minute budget. Keep activities distinct and the actual interactive UI mandatory.

## Selection policy

1. Prefer a scenario that serves an **active can-do**, not whichever visualization is easiest. Do not invent a CEFR certification or infer writing weakness from skips.
2. Exclude the scenario family or dominant mechanic used in the previous **two verified full lessons** if a different relevant family is available. If no history is accessible, do not hallucinate it.
3. Select a **meaningful action** where a learner choice physically/logically changes something: placement, route, contents, assignment, repair state, opening time/priority. Never just animate a decorative badge.
4. Plan five assessed tasks across **notice/predict, retrieve/compare, manipulate, consequential decision, fresh-context transfer**, with distinct operations and ≥3 controls. The correct response cannot be obtained merely by reading the answer in another pre-answer prompt.
5. When **real visual assets** are tool-verified and relevant, use them for photo-grounded tasks. When unavailable, draw a **native SVG diagram** that communicates the needed relation; grade only actual visual-symbol operations.
6. No same universal template repeated: rewrite scene, action, stakes, language focus, distractors and actual feedback condition; default Parcel Mission is **only an implementation example**.

## Six scenario families

| Family, likely level | Meaningful visual scene and change | Five task operations / controls | Observable transfer |
|---|---|---|---|
| **Lost-and-found desk** (A1/A2 can-do: ask about a lost item) | SVG desk with bag, hat and key; learner chooses a shelf, then **Move** visibly changes the bag's position | track scene / label **different** object / position prediction / polite chunk request / message to different employee | Ask where a *different* item was found; no copyable wording |
| **Café replacement** (A1/A2 can-do: ask for an alternative politely) | Two cup/container icons and an order ticket; user selects available substitution and the **ticket status changes** from unresolved to prepared | infer menu stock / identify drink container / allocate drink by select / order polite chunks / original question to a new server | Ask whether a new menu ingredient is available |
| **Bus stop detour** (A2 can-do: choose directions) | SVG station map with two routes and a blocked bridge; click a real route selector, **route path/highlight changes**, and give a consequence | notice blocked segment / compare journey destinations / predict route result / repair a direction / fresh instruction to visitor | Give directions on a different small route |
| **Workshop fix** (A2 can-do: describe issue and request help) | Diagram of bike frame, wheel and lamp. Tap repair part via **native labelled choice** (not an inert image hotspot), scene changes from broken to repaired | identify pictured symptom / classify tool / choose repair priority / order request / new different repair report | Report a separate device issue |
| **Apartment delivery** (A1/A2 can-do: specify locations and possession) | SVG building floor and a moving parcel; select floor/apartment, **parcel moves**; visible location/state follow-up | predict path / retrieve room/location noun / inspect moved object / choose helpful instruction / new owner's message | Explain location of another item |
| **Day-plan decisions** (A2/B1 can-do: make a plan and justify) | Clearly labelled *fictional* three-stop schematic with task-relevant obstacles or constraints. Choose order to **update route**, not real ETA claims | identify constraint / compare two options / change chosen stop / revise plan with meaningful chunks / justified alternate plan | Explain a choice for a changed constraint |

## Pedagogical specification for each invented task

For every exercise, privately identify:
- **Learning action:** recognize, retrieve, predict, construct, reason or independently communicate.
- **Source of answer:** verified photograph detail, actually displayed SVG relation, text passage, earlier learner prediction or world-language rule. Never claim a real image if the evidence is textual or merely decorative.
- **Working affordance:** native controlled `radio-group`, `select`, `input`, click-order `button`, `textarea`; working state/Undo/Reset and one Submit. Source controls must remain available with a keyboard.
- **Rubric with accepted variants:** clear deterministic answer and feedback condition, or semantic criteria for natural language.
- **Progression:** after correctness, increase complexity by changing the communicative constraint or removing scaffolding; after independent errors, change support and operation, **not** just repeat the identical screen.
- **CEFR:** guided success = supported evidence only; omitted writing remains unassessed. With no observed spoken/heard media do not award spoken/listening outcomes.
- **Narrative quality:** state who needs help, why the learner's action matters, what changes after it, and how a later task uses that change. Avoid five unrelated questions merely sharing a title.

## No-output failure modes

- Five repetitions of multiple choice with background image: **reject**.
- Source image is unavailable, therefore replacing lesson with five paragraphs: **reject**.
- Clickable-looking photo with no actual hit regions: **reject**.
- Correct branch is pre-announced in caption or vocabulary before prediction: **reject**.
- Three lessons in a row with the same courier/mug sentence shuffled: **reject if verified history shows it**.
- Student skips optional original writing: mark `not_assessed`, preserve difficulty, keep game/reading evidence separately.
