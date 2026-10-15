# Lazy UI patterns — construction and independent use

Use only for building, correcting or applying language.

- **sentence builder:** arrange meaningful chunks or write a complete utterance; native ordering/select or typed fallback. Chunk prompts count as scaffolding.
- **card ordering:** if real keyboard-accessible drag UI is supported, use it; otherwise numbered/selected order with the same rubric. Do not claim drag happened when there was only a picture.
- **error repair:** one contextual error, rewrite for natural meaning; optionally produce a fresh example. Do not reveal correction before submission.
- **explanation:** one or two short sentences explaining a choice or situation; grade communicative clarity rather than exact preferred wording.
- **independent application:** a real communicative prompt with an unprompted response. Typed responses support writing/typed interaction, not speech.

Across three or more tasks, pair at least one construction/independent application with purposeful retrieval or recognition if useful.


## Distinct semantic chunk builder vs word-card ordering

`sentence_builder` combines **meaningful chunks** (e.g., "I called" / "the technician" / "at eight"), often with a tense or connector choice, then asks for an independent reformulation in a new context. Native select/buttons plus editable preview and Undo/Reset work; typed text is an honest fallback. Its scaffolded success is not independent fluency.

`card_ordering` instead sorts **individual tokens** with accessible click-to-order controls, keyboard operation, visible selection and Undo/Reset; when no genuine drag gesture is available do not claim drag-and-drop. Track completion only when all required tokens have been placed; wrong word order triggers provisional cue but not automatic mastery.

## Timeline ordering

`timeline_ordering` reconstructs events in a story by temporal/causal order. Render 3–5 short **event cards**, tap-to-order buttons, a visible ordered sequence, Undo/Reset, and optional actual moving timeline as illustration; animation is never the only carrier of meaning. Require an unambiguous chronology in trusted source context before using immediate exact-order checking. Ties, events without established time, equivalent orderings, or ambiguous before/after require teacher assessment instead of rigid red feedback. Follow with an unaided English sentence explaining *before*, *after*, or *because*. Modality = event sequencing (guided); it does not by itself prove independent narrative production.
