# ASIT — provisional live feedback, tap explanation and picture-word tasks

This is a specification for native ChatGPT controls, not an installed web app. Node.js helpers are test oracles; the assistant must render real native UI.

## Deterministic right/wrong after each input

Eligible: fixed single-choice, unequivocal verb-form selection, completed ordered word-card sequence, a typed image label with a finite accepted-answer list. Use controlled client state and on-change callbacks. Status is `unanswered`, `correct`, `try_again`, or `deferred`. Show textual status immediately after the learner first interacts, without disclosing an unattempted answer. Wrong answers get a small *non-spoiler* cue, and may be revised.

Track `first_response`, `revisions`, `local_checks` and `hint_level` **within each subtask's answer**, if meaningful; keep outer `ASIT_ATTEMPT_V2` keys unchanged. Local metadata is untrusted evidence and must be checked against the saved Activity/rubric. A corrected answer following instant feedback is assisted practice, not proven first-try independent accuracy.

**Exactly one form-wide Submit** sends the new chat message for consolidated assessment/storage; local checks do NOT save to Google Sheets, call the model, or prove mastery. Free writing, unrestricted paraphrases and uncertain synonyms are `deferred` to post-Submit review, never rigidly marked wrong by exact string matching. No audio or image modality claims without genuine source access.

## Underline/tap to understand

Use only beneficial unfamiliar words/phrases, underlined and clickable, with native popover containing a short explanation, one example and optional translation. Avoid leaking answers to a scored exercise; if hint content overlaps the answer, track hint use. Popover must not clear the form. Native UI does not expose a guaranteed action to open another ChatGPT thread floating over the current lesson. Do not pretend that an inline popover is a separate chat. A client may support optional manual side chat/branching.

## Picture with a typed English label underneath

1. Fetch/render a **real relevant image**, not an emoji, static blank or word description masquerading as a picture. Place image above a native text input asking `What is this in English?` or an appropriate short phrase. Caption must not disclose the answer.
2. Trusted Activity stores target word, carefully chosen accepted natural aliases (e.g. `bike` / `bicycle`) and rubric, plus `image_prompted_written_recall` as modality/operation. Case, excess spaces and trailing punctuation are ignorable for objective local check.
3. Once learner starts writing, a finite exact alias match may show `Correct` immediately. Unrecognized but plausibly valid synonyms remain `deferred`; consolidated teacher evaluation can accept them.
4. Neutral accessible alt/fallback should be available. An alternative text cue changes observed evidence to `text_prompted_recall` and may add support/hint, not independent visual assessment.
5. If the image fails, choose explicit text fallback or another exercise. Never score a nonexistent picture. One Submit for the whole lesson.

## Acceptance checklist

- [ ] Wrong objective choice shows `Try again` immediately; correct shows `Correct` before Submit.
- [ ] One form-wide Submit remains; final assessment is based on the trusted stored rubric.
- [ ] First try, retries and hints are not mistaken for independent mastery.
- [ ] Free-text writing is `Review after Submit`; unanswered writing is `not_assessed`.
- [ ] Real image is placed directly above text entry; aliases and text-only fallback work.
- [ ] Tapping a term opens inline explanation without resetting answers.
- [ ] No fake side chat, fake picture, fake saved receipt or fake audio assessment.
