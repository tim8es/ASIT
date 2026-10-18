# Visual-first lesson standard — full ASIT lessons (v0.2.7)

**When to load:** Every planned full lesson, including continuation, visual vocabulary and remediation. Do not load for a short grammar answer, normal dialogue or explicitly text-only practice. This is a runtime teaching contract, not a JavaScript process.

## Default visual-first decision

Apply [rich default lesson](rich-default-lesson.md) **to all full lessons by default**. When verified photographs are missing, **preserve a visual learning experience** with a labeled SVG diagram, native input and a learner-controlled scene update. The resulting tasks are `visual_symbols` and must not be recorded as real photo/image recognition. An all-prose quiz because image search did not return an asset is a **release failure**, not a valid "visual-first fallback" unless the learner explicitly chose text-only or the UI host cannot render it. Use [complete native UI](../../asit-exercises/references/complete-native-lesson.md) to avoid inventing interaction.

## Learning-experience references (pedagogical patterns, not copied assets)

- **Duolingo:** short approachable challenges, visible selected state, low-friction retry and immediate *provisional* explanation for unambiguous answers.
- **Skyeng:** clear natural English examples, contextual conversation, grammatical feedback and transfer to the learner's own message.
- **Brilliant:** active discovery and reasoning: **notice → predict → manipulate → explain → transfer**. Show a meaningful visual situation, ask for a prediction *before* announcing a rule, let the learner change a card/choice/order and observe real feedback, then ask why and apply the idea in a fresh sentence. The sequence is a pedagogical design choice, not a demand to invent unsupported animations or simulations.

For a visually teachable 4–5-item lesson, give at least **one short discovery cycle** where the learner predicts an outcome or rule from a grounded scene before reading its explanation. **Do not replace this with an informational illustration followed by unrelated multiple choice.** Real controls must manipulate a meaningful choice, picture pairing, word order, or scenario state; never fake physics, live animation or automatic image segmentation. Ask for a brief reason when doing so creates a distinct learning operation; otherwise conserve the seven-minute budget.

Illustration: in a room scene show a phone first **on** a table; ask which caption matches; then show it **in** a box and ask the learner to predict which preposition changes; then build a sentence from word cards and send a natural message about a different object. Reveal the explanatory contrast only *after* the first interaction. Content must be original, not copied from reference applications.

## Hard media/source condition

First read [media provenance](media-provenance.md). An image tag with a syntactically plausible ref but no corresponding successful image-tool result **is not an image**. Avoid speculative tool result IDs even when the same ID was mentioned in a prior assistant answer. No corresponding verified source => do not register an `image_choice` or `image_label` Activity. Change to real accessible text or `visual_symbolic` diagram activity *before* Save Gate, with an entirely matching trusted rubric. Real source retrieval does not establish successful client display; treat user reports of missing images as `not_assessed` for affected items.

For interactive visual games consult [game patterns](../../asit-exercises/references/game-patterns.md) for a concrete DIL-controlled SVG scene, image-to-word and matching. Render a genuine state change and show after-action feedback; do not present a static cover as motion graphics. Test actual motion support separately or use a static-state fallback.

## Pre-render experience plan (required)

Before registering Activities or rendering UI, determine from current goals and *verified* recent Attempts:

1. `can_do` communication objective; storyline; learner's requested duration and exercise count (preferences take precedence over defaults); assessed operations and genuinely supported modalities.
2. Capability facts: can a relevant real image be displayed, can the client handle controlled choices/card ordering, and is real sound accessible? Never infer a capability from the existence of a catalog entry.
3. Five-task example when image support and the topic make visuals useful: (1) `image_label` from an unlabeled picture, (2) `image_choice` comparing grounded alternatives, (3) `matching` or word `card_ordering`, (4) `sentence_builder` or contextual repair, (5) independent picture-grounded communication. Four-task lessons combine operations without skipping unaided production. Do not force these exact types; adapt the operations to the skill. Include at least three distinct cognitive operations and two response-control patterns in a 4–5-task lesson.
4. Select actual image-dependent operations **before** fetching/rendering images. The image must carry evidence needed to answer, not just decorate a cloze, text translation or grammar rule. A lesson cover never counts as a graded image task.
5. Use a recent-format rotation: look at the previous two full lessons when the history is actually available; avoid reusing the same dominant task type, and change operation after two independent errors. Without stored history, use the current chat only. Never fabricate previous formats.

## Default visual experience — not merely optional decoration

For a **full planned lesson with suitable visual content and working image rendering**:
- Put a distinct, useful **16:9 hero/cover** immediately under the title/outcome. Use the actual lesson theme. If the first image is also the task scene, distinguish the cover from the task prompt and do not reveal answers.
- Provide at least **two graded visual interactions** in a 4–5 task lesson whenever the subject naturally supports pictures (objects, places, actions, situations, spatial relationships, visual description). At least one should be `image_label` or `image_choice` with a *real* image and a working input immediately next to it; the second must test a distinct operation, not another radio choice over the identical evidence.
- Prefer clear compact image flashcards and picture-grounded sentence construction; pair with genuinely independent written application. A set of unrelated stock photographs is not a lesson. Use visual cards as evidence, not decorative filler.
- Give each pictured card one instruction, image immediately next to its answer input, real selected/typed state, and provisional feedback only for unambiguous finite answers. Correctness of natural open responses is reviewed after Submit. Accept common synonyms and do not leak the assessed word in captions, alt labels displayed to the learner or vocabulary at the end before the answer.
- A meaningful nonvisual lesson (e.g. long reading, question word order, professional email) may have fewer or zero image-scored tasks. **A user-requested text-only or accessibility/low-bandwidth mode overrides the visual defaults.** When images cannot actually render, replace image-scored tasks with accessible text-based operations and honestly change the assessed modality and mark unavailable visual evidence `not_assessed`. Don't wait indefinitely for an image or fabricate one.
- Never rely on more than 2–3 independent large images in a seven-minute lesson by default; reuse a relevant scene for different *operations* when this aids continuity. Do not fetch images merely to satisfy quotas. Budget user time over visual abundance.

## Cards and activity affordances

| Card | Image / controls | Learning evidence |
|---|---|---|
| `image_label` | Real uncluttered picture directly above text input; no answer text in visible image | Picture-prompted word/phrase retrieval; plausible aliases deferred |
| `image_choice` | Real image(s), clearly different alternatives and native radio/cards | Image-grounded recognition, not independent language production |
| `matching` | Picture-to-phrase or situation-to-phrase native selectors / pair codes | Association; no fake drag or keyboard-inaccessible tile |
| `card_ordering` | Single word/token cards; tap-to-order, Undo and Reset, keyboard fallback | Guided word order, not free writing |
| `sentence_builder` | Meaningful multiword chunks + preview; follow with new unaided sentence | Guided construction; independent transfer graded separately |
| `scenario` | Useful story frame, real choice/reason or written message | Appropriate use in a new communication situation |

A click on static `AsyncImage` is not a hotspot. Do not claim `image_hotspot`, drag-and-drop, audio or speaking until those interactions work on the actual client.

## Required quality check before delivery

Reject/regenerate the **planned task mix**, not learner data, if any applies:

- The lesson could be completed unchanged with all images removed even though it claims `image_label`, `image_choice`, or image-grounded production.
- Full visually suitable lesson has no meaningful cover/scene without an explicit reason, or has just one image-assisted choice with four generic text/translation tasks.
- Three tasks repeat the same cognitive operation; two or more near-identical translation prompts dominate.
- `image_label` has no actual picture directly above input, or the image/caption reveals the expected word.
- Tap-to-order has no actual state/Undo, local Correct/Try again appears before interaction, or a nominal Submit cannot send the responses.
- The rubric/Activity IDs were not defined and pre-registered when verified consented Save Gate is active. Pre-register **each** graded subtask, preserve privacy, and read back BEFORE showing it.
- Success in supported choice is marked independent CEFR mastery, text is labeled speech/listening, or a client-local UI state is treated as a saved Attempt.

**Fallback:** If the visual prerequisites fail, provide a genuinely useful, honest text lesson that does not pretend to assess images; explain the concrete limitation briefly. Do not block teaching just to search for art. Preserve one real Submit and the verified assessment/save path.

## Examples of right versus wrong

Good for `in/on/under` and `is/are`: picture-label one object; compare two distinct pictured arrangements; tap-order words to describe the scene; repair a plural agreement error in a message; send a new two-sentence instruction. Wrong: one decorative office diagram followed by a dropdown, two grammar questions and two translations that barely depend on the visual.

Good for past-event reading: a short message timeline or document snapshot that is genuinely necessary for the questions; event order cards; independent reply. No arbitrary object photos required.

**Speed:** Preplan in a small conceptual task map, read only the selected pattern family, render in one response. Do not load all 18 reference implementations or traverse GitHub on each lesson.
