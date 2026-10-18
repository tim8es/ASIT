# Evidence-driven lesson selection — subject-neutral model-followed decision contract

Load on actual lesson planning / adaptation, not on routine answer grading. These are explicit model-followed decision rules, not executing JS or a scheduler. No repository access is required at teaching time.

## Validate and scope before selecting
- Prefer current learner request, then verified active Goals/Plans and individual preferences, then due Reviews, then observed gaps. A self-chosen outside-plan exercise is permitted and must not rewrite the active plan.
- Resolve only verified, consented, bounded learner state. Do not assume a cross-chat history exists. Discard malformed attempts and mismatched competency, observed modality or operation; do not infer speaking or listening from typed text.
- Validate competency IDs are unique, dependency IDs exist, dependencies are acyclic, and priority (if present) is in 0–5. Missing or circular prerequisites mean the goal cannot be called ready.
- For candidates with equal evidence and constraints, use a stable competency ID tie-break; don't randomly switch goals on every invocation. Do not invent goals to fill a missing store.

## Optional explainable priority oracle (port of src/planner.mjs)
When ranked choices are genuinely needed, assign each **unblocked** competency an internal score. This is a heuristic, NOT a calibrated educational metric: base 10 × configured priority (default 2); active user-chosen objective +30; due review +25; unassessed +12; emerging or supported +10; recent two relevant needs_support attempts +8; transferable −30. Unmet prerequisites block selection regardless of score; the retired oracle used −100 but blocking, not numeric rank, is decisive. Choose largest score, stable competency ID as tie-break. State the reason to the learner if asked, not the artificial score as a measure of ability. Invalid/missing review dates cannot count as due.

## Adaptation on last relevant attempts (port of src/adaptation-policy.mjs)
Scope by *same competency and required modality + operation*; exclude not_assessed and provisional UI feedback.
1. If the two latest scoped graded attempts both need_support: increase support and SWITCH the operation/representation.
2. Else, if the two latest are correct, no hints, from **two distinct sessions and contexts**, and neither is recognition/unknown operation: offer a harder fresh transfer task.
3. Else, if the latest used a model hint or needs_support: increase support.
4. Otherwise maintain difficulty; if there is no verified scoped attempt, diagnose instead of claiming progress.
Do not infer transfer from first-response UI metadata. Preserve source Attempt IDs and the state revision in any consented adaptive-profile rationale; don't override user-chosen preferences. Retain at most four recent decisions, referring to at most three source Attempts per decision. This is a bounded summary, not a new personal database.

## Separate format adaptation from ability adaptation

Read [two-axis format adaptation](format-adaptation.md) when the learner intentionally omits writing, repeats omissions, requests a game or visual mode, or changes an input preference. Skips are `not_assessed`, their reasons are `unknown` unless explicitly reported. Neither a deliberate omission nor a blank field may trigger a `needs_support`-driven difficulty reduction. After repeated omissions **rotate the response control and narrative mechanics**, rather than shifting an identical textarea into an earlier card. Give a voluntary micro-original response when appropriate and leave independent writing **unassessed** if not attempted. Do not silently infer a preferred mode from a single skip.

Use the canonical [evidence compatibility mapping](../../asit-progress/references/evidence-compatibility.md) for scoped task-vs-competency evidence: compare broad task families as well as modalities and support level, not brittle exact string equality; unknown mappings are excluded from mastery.

## Pacing and remediation
After a repeated independent mistake, change the cognitive action (recognition → reconstruction → independent situational transfer). Stop focused remediation after two cycles by default; continue the broader plan with a different can-do. A new lesson still requires answer-integrity audit and Save Gate preflight before any graded Activity is displayed. Never report ranking or progress as computed by a backend.
