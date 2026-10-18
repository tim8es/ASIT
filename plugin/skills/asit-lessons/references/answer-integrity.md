# Answer integrity + immediate-feedback lesson gate — ASIT v0.2.10

Load for every graded lesson or follow-on, **before finalizing rubrics, Save Gate Activity pre-registration, or presenting any tasks**. This is a mandatory teaching-design gate. It is not a client-side security mechanism or a clipboard hook.

## Default: immediate correctness verdicts, no advance hints or model answers

- **User preference (explicit):** keep the interactive UI's immediate **Correct** / **Incorrect — Try again** indication for deterministic multiple-choice, straightforward cloze, and fully specified completed ordering tasks. A learner must actually select/enter a response before any verdict appears. Indicate correctness visually and in text; allow changing an answer and accessible retry/Undo/Reset. A provisional local verdict is not the final ASIT grade or a saved Attempt.
- **No advance hints:** before Submit, and in particular before the first answer, do not reveal the key, corrected sentence, target grammar form, filled target blank, color-coded solution, hover spoiler, worked model or explanation giving away the answer. After an incorrect attempt, show a clear **Incorrect / Try again** status, **without giving the correct answer, eliminating named options, or a directional clue**. A non-spoiler neutral acknowledgment is optional but not a hint. After a correct attempt, show **Correct**; a brief why can appear only if it does not expose the key to another unanswered task. Full solution rationale may wait until final Submit.
- Do NOT interpret "no hints" as "hide Correct/Incorrect until final Submit." That was an overcorrection in v0.2.9. Preserve the default `asit-exercises` / `visual-feedback` immediate-check behavior, with stricter anti-spoiler constraints on incorrect feedback.
- Track first nonblank selection, current answer and optional revision count independently in UI where supported. Mark this telemetry **unverified** in grading; a corrected choice is still correct as a final response but not proof of an unassisted first attempt.
- **Independent production and natural open responses** require semantic teacher assessment after final Submit; don't show false exact-string Correct/Incorrect while typing or equate a copied snippet with independent proficiency.
- Finite multiple-choice options necessarily include the correct option; avoid answer signals in length, style, emphasis and position. Binary multiple-choice has an intrinsic elimination risk after a wrong-result verdict. Where genuine independent discrimination is intended, prefer three or more plausible choices or a different task format. Do not falsely promise that instant feedback can prevent inference or copying.
- Learners must be able to read authentic information needed for comprehension (messages, signs, schedules). Factual retrieval of a time/place is valid reading or visual recognition, not independent writing.

## No-copy cross-task separation

- **Independent production** must not be solvable by copying the whole answer or by changing a pronoun in a sentence already visible in another task, source passage, answer choice, caption, chunk assembly, vocabulary footer or previous model example.
- Keep connected lessons coherent by **changing the communicative situation** for the independent task: different person/place/object/time/goals and a specific new recipient or new constraint. Reuse a grammar pattern, not ready-made phrasing. If source facts must stay the same (e.g. answering a real coworker's question about a schedule), require meaningful selection, synthesis, decision, reason or transfer rather than verbatim reproduction; grade independent language conservatively.
- Guided `sentence_builder` is valid scaffolding but scored as **guided construction** only. Never immediately ask the learner to retype or paste its completed sentence as “free production.” A final independent task must require different content and wording.
- An assessed vocabulary answer must not be printed in its nearby image caption, image alt surfaced as text, task title, explanation, translations, glossary, or unrelated task. Provide vocabulary **after Submit** if it would disclose answers; otherwise only include non-answer support terms.
- Do not embed reusable model responses in input `placeholder`, default textarea value, copy controls, prefilled answer cards, illustrative examples or the UI's selected state. Placeholders stay neutral (e.g. “Write your own reply”).
- Do **not** attempt to block paste with unsupported browser/DOM events, hidden overlays, disabled inputs, fake paste detection or claimed anti-cheat monitoring. ChatGPT native text fields cannot reliably enforce clipboard restrictions. Reduce shortcut value by task design and evidence labels instead.

## Required pre-render answer-leak audit

For every graded `Activity`, and across the entire lesson that includes it:

1. Identify its **trusted answer/rubric, assessed modality/operation and independence requirement** BEFORE display. Review rendered headings, task stems, option strings, images and visible labels, captions, `alt`, example answers, placeholders, tooltips, text source, card/chunk text, vocabulary, and local-feedback conditional branches.
2. **Answer leakage:** Is an exact answer, near-equivalent answer, grammatical transformation or decisive clue visible **before the learner's first attempt**? If yes, revise the task. Distinguish this from the explicitly required immediate after-response Correct / Incorrect verdict. An after-correct explanation must not answer a different unanswered task.
3. **Copy/paste bypass:** Could the learner solve an allegedly independent task just by copying a complete sentence/response from anywhere above, including a previously solved guided item? If yes, change person, scenario or information demand so the learner must produce new language.
4. **Reasonable evidence:** A task that only tests matching or selecting a visible word is labeled `recognition`; copied or scaffolded language is not `independent` or `transferable`. Inference requires synthesizing at least two grounded facts; if a question is answerable merely by copying a timestamp, call it factual retrieval rather than inference.
5. **UI:** One final Submit remains a real event, independent of immediate local correctness checks. Before any response display no correctness/key. After selection or completed ordering show Correct / Incorrect — Try again immediately on deterministic tasks; an incorrect result must not reveal a solution or a directional hint. For open responses show Review after Submit. Keep first/revised choices as *unverified client telemetry*. Complete model corrections may appear after final Submit.
6. **Registration:** Perform this audit **before** registering each Activity in Google Sheets, so stored rubrics and the visible task refer to the same validated prompt and skill. If an issue is found after registration but before render, update the trusted Activity then read back BEFORE showing the revised task; if pre-registration is unavailable, be explicit about unsaved practice.

## Regression examples

REJECT: “Yesterday, Maya sent an email” shown in a story and then `Write: Yesterday, Maya sent an email` scored as independent production.
REJECT: a guided sentence builder “I will meet you at the ticket barriers” followed by free writing where that sentence answers the exact same prompt.
REJECT: a word-image input whose caption, SVG text or vocabulary footer says the target word before response.
REJECT: a `Correct!` banner visible before selecting an answer, or an incorrect-result hint that names the winning option.
REJECT: suppressing correctness until final Submit for an unambiguous choice after this user's explicit request to retain instant feedback.
ACCEPT: a deterministic choice displays `Incorrect — Try again` after a wrong selection without revealing the key, and `Correct` immediately after a successful selection; the first selection remains unverified UI telemetry.
ACCEPT: read a train board for the actual time (score as factual retrieval), then write an original reply to a friend who asks whether a **different connection** can still be made, requiring a new time comparison.
ACCEPT: assemble a past-tense sentence from given chunks (score as guided) and later write a one-sentence explanation of a **different event**, with no ready-to-copy exemplar.

These are design and rubric guardrails, **not proof** that physical clipboard use or tool-assisted cheating is impossible. Inspect actual rendered lessons and learner behavior when dogfooding.
