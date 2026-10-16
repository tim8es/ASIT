# UI Orchestrator — compact selection policy v0.1

**Role:** universal interface selector for ordinary ChatGPT learning, separate from curriculum planning and assessment. It chooses the form, hint, feedback and retry presentation based on what learners must **do**, not on decoration. The orchestrator is not a hosted app; [`src/ui-orchestrator.mjs`](../src/ui-orchestrator.mjs) is an optional testable reference, not something ChatGPT automatically executes.

## Small bounded decision process

1. Identify intended learner action: `remember`, `recognize`, `read`, `build`, `explain`, `apply` or `interact`; identify the target competency, operation and actual modality.
2. Decide **UI or no UI**. Free conversation, direct questions, open-ended discussion or simple word clarification normally use plain chat; planned lessons use one combined form.
3. For a planned lesson, use the [configurable lesson contract](../docs/SEVEN-MINUTE-LESSONS.md): read learner-owned duration and exercise-count settings (defaults seven minutes and four tasks; up to five recommended for default sessions), then topic → rule → configured related tasks → vocabulary → **one Submit**. Defaults are not hard limits.
4. Select controls first by learning operation and assessment validity; then accessibility/platform capabilities; only then novelty. Rotate among equally sound patterns within and across lessons, using recent type history. If 3+ tasks and suitable alternatives exist, use 2+ complementary patterns.
5. Check **real capability**: audio playback for listening, access to learner audio for spoken assessment, actual relevant images for image tasks, actual drag mechanics and keyboard fallback for drag. Otherwise fall back to accessible text/select/numbered ordering with accurate modality labels. Never represent a static mockup as working interactivity.
6. After learner interaction, **show provisional instant checks** for deterministic single-choice, fixed-answer grammar choices, finite accepted image labels, and completed word-card ordering. Use native controlled state for `Correct` / `Try again` / `Not answered`; do not give away an untried answer. Capture first try, revisions and hints inside the eventual answer; after ONE final Submit, re-evaluate with trusted Activity metadata. Open writing and unrecognized plausible synonyms are deferred.
7. Keep narrative sentences typographically **continuous**. Use an underlined popover trigger only when it stays inline; if the ChatGPT client renders a popover as its own block, show the complete sentence uninterrupted and place the underlined explanatory control after it. Never split a sentence into three stacked pieces. Popovers cannot force parallel chats.
8. Distinguish clue progress from lesson completion. **Every required blank task** (especially final independent writing) prevents `completed` or finale unlock; status is `incomplete`, missing task `not_assessed` (not incorrect). Do not silently accept missing text just because objective clues are correct. Offer continue writing or explicit incomplete early finish with the same single Submit; preserve all entered answers.
9. Choose concise task instructions, appropriate hint, trusted rubric, one response control per subtask and genuine Submit. Assess after Submit and offer delayed review. Limit single-construct diagnostic retries.
10. Do not conflate recognition, writing, dialogue typing, speaking, pronunciation or listening in evidence.

## Operations → patterns

| Operation | Candidate controls | Primary evidence |
| --- | --- | --- |
| remember | contextual cloze; brief retrieval; image with typed label below it | recall (image-prompted when applicable) |
| read | readable short passage plus gist/detail questions | textual reading comprehension (never listening) |
| recognize | meaning choice; matching; genuine image choice; authentic image-region hotspot only with accessible clickable controls | recognition / visual region recognition |
| build | **semantic chunk builder**; individual card ordering; event timeline ordering; error repair | guided language construction / event sequencing |
| explain | short justification; written explanation | explanation in observed modality |
| apply | realistic independent response; scenario | independent application if unprompted |
| interact | live dialogue where feasible; ordinary chat | interaction in observed modality |

## Lazy pattern loading

Keep this core policy small. [`patterns.json`](patterns.json) is an index, not a mandatory full spec. **Only when a pattern is chosen**, read its family: [recognition](patterns/recognition.md), [construction](patterns/construction.md) or [interaction/media](patterns/media-interaction.md). Do not consume context by loading all detailed patterns every turn. If only the installed Engine is accessible, use its compact core routing and accessible fallbacks without pretending GitHub is installed.

## Dogfooded type boundaries and capability truth (catalog v0.5)

There are **18 registered patterns: 17 learner practice formats and 1 read-only `progress_explorer`**. The separate index is the authoritative count; these are *contracts and candidate renderings*, not 18 installed websites. Default short lessons still choose just 4–5 purposeful exercises.

- `sentence_builder`: manipulate **meaningful semantic chunks** and transfer to a new written sentence. `card_ordering`: tap and order **individual word cards** with Undo/Reset and keyboard fallback. Same surface may be reused, but rubrics and assistance levels differ.
- `reading_comprehension`: one real readable passage, a gist question and a detail/evidence question; no audio inference.
- `timeline_ordering`: unambiguous actual event sequence with click-to-order, Undo/Reset and optional movement illustration; if more than one chronology is valid, defer feedback instead of forcing one exact sequence.
- `image_hotspot`: only if **both** genuine relevant image and keyboard/pointer-operable selectable regions are available. Static image plus nearby radio buttons is `image_choice`, never a hotspot. If unsupported, visibly fall back and change evidence modality; no fake visual-click evidence.
- `dialogue`: at least two real learner turns with a meaningfully responsive ChatGPT follow-up. One text input is preparation, not proof of sustained dialogue; plan it as a conversation/checkpoint, not a fake single-form exchange.
- `listening` and `spoken_response`: a real accessible source/recording must exist. Their presence in the index does not imply that the native ChatGPT UI can play or record arbitrary audio; otherwise mark that modality `unassessed`.
- `progress_explorer`: verified private evidence only, no fake mastery percentages. First response, hints and revisions are provenance hints until the trusted saved rubric is checked.
- Specific out-of-plan exercise request: `selectUiPattern({requestedType: 'timeline_ordering'})` picks the matching type or returns `unavailable` for an unrenderable capability, never silently substitutes a different requested type.

See [UX dogfooding report](../docs/UX-DOGFOOD-2026-10-16.md). Run client-specific acceptance before claiming new native interaction functionality.

## Voice-first delivery route

For `listening`, `spoken_response`, or audio-rich `dialogue`, when user wants a real sound-based lesson *inside ChatGPT*, select the [native same-chat Voice handoff](../docs/VOICE-FIRST-LESSONS.md) rather than a nonfunctional audio tile. The learner taps Voice manually; the UI cannot activate the device microphone from a regular DIL control. Use the `src/voice-session.mjs` **offline** helper only as a planner/test oracle. No sound is claimed until audible teacher speech actually occurs; a text transcript is not raw spoken evidence. Voice is a live multi-turn activity and may end with a normal text recap/checkpoint. Preserve the 18-pattern catalog (same `listening` and `spoken_response` types; delivery differs, not another fabricated type).
