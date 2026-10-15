# Lazy UI patterns — recall and recognition

Use only when the objective requires retrieval, recognition, matching or actual-image comprehension.

- **cloze:** one contextual blank, native text input, accepted grammatical/semantic alternatives. Ensure the post-task vocabulary does not expose the scored missing phrase beforehand.
- **meaning choice:** 2–4 unambiguous options; require justification only when meaning is the intended operation. Recognition, not production.
- **matching:** pair words, meanings or situations using native selects or accessible text codes; do not fake draggable cards. Recognition only.
- **grounded image choice:** requires a real relevant image, appropriate alt text, and mutually distinguishable options; if unavailable change to text-only meaning choice and report textual modality.
- **reading check:** show actual short passage then ask for gist or detail; never mislabel text comprehension as listening.

Only the selected pattern needs its full rendering instructions and scoring criteria.

## Live right/wrong and image labelling

- When a task has one unambiguous correct selection or a finite trustworthy accepted-answer set, update text status **on input change**, not only after Submit. After a wrong answer show a short cue such as `Try again — check the time` without revealing an untried answer. Keep the final single Submit.
- **image_label:** show an actual relevant picture, then a native input directly **below**. Ask the learner to type the English word or short phrase. The image must not carry the target answer as a visible caption. Accept natural synonyms, case and insignificant punctuation when confirmed by a trusted rubric. Other plausible responses are `Review after Submit`, not automatically wrong.
- Inaccessible or failed images require an explicitly *text-cue* alternative, assessed as text-prompted recall rather than visual recognition. An accessible alt description may supply hints and must be taken into account when reporting independence.
- Preserve first attempt, number of checks/revisions and hints inside the submitted answer. Local `Correct` is not a saving receipt or transferable mastery.


## Reading comprehension — distinct catalog entry

Use `reading_comprehension` when understanding an authentic-looking **actually provided text** matters. Present a readable continuous passage of reasonable length, then separate **gist** ("What happened?") from **specific evidence** ("When/why did it happen?"). Keep the text available when answering unless retrieval-from-memory is an explicitly intended operation. The rubric cites details in the passage and accepts equivalent explanations. **Reading is not listening**. On mobile do not cut sentences around popovers; place clickable explanations after the passage if inline rendering breaks typography. Avoid vocabulary popovers that disclose the correct answer to a scored question.

## Image hotspot — capability-gated recognition

`image_hotspot` asks the learner to identify/click an object **inside a real relevant image**. Render this type only after confirming both `hasRelevantImage` and `hasInteractiveImageRegions`, meaning actionable, labeled regions work with pointer **and keyboard**, with discoverable focus, a visible chosen state and semantic stable region IDs in a trusted rubric. Test selected region by its ID, never by fabricated pixel clicks; ambiguous overlapping regions must be deferred. A static `AsyncImage` alone **does not** provide hotspots. A separate overlay requiring inaccessible point tapping is not acceptable. If true hotspots cannot be rendered, offer `image_choice` with actual image and accessible options, or text-only recognition without claiming visual-location ability. Alternative alt/text cues must not falsely inflate unassisted image comprehension.
