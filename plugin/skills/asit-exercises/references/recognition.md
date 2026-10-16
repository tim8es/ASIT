# Recall/recognition, authentic text and images

- **Cloze**: a coherent sentence with a contextual blank; native text field; accept sensible inflections/phrases. End vocabulary must not reveal the assessed blank until after Submit.
- **Grammar contrast**: 2–4 plausible distractors distinguishing meanings; when the competence is explanation, also ask for a reason. Choice alone is recognition.
- **Matching**: two small sets with select controls, pairs or accessible letter/number codes. No inert drag illustrations.
- **Reading**: actually present a short continuous passage, ask one gist and one detail/why question. Text remains available unless retrieval after reading was explicitly chosen. Don't call it listening.
- **Image label**: show a real relevant image; immediately underneath display native text input. No label overlay giving away the target. Accepted aliases in trusted rubric; if image missing, use explicit text-cued written retrieval instead. Alt text may make response supported rather than independent visual recognition.
- **Image choice**: actual image plus clear, accessible options that can be discriminated. If no image, change type to textual recognition.
- **Image hotspot**: require confirmed semantic clickable regions working with keyboard/pointer, stable region IDs, focus and visible state. `AsyncImage` by itself is not a region-select widget. Use image choice fallback, never fake pixel coordinate evidence.
- **Feedback**: after a concrete first attempt deterministic responses may show `Correct`, `Try again` with a clue, or `Review after Submit` for ambiguous aliases. Keep final Submit single and do not equate UI feedback with saved competence.
