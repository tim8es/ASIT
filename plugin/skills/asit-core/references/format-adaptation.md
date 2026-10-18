# ASIT two-axis adaptation — ability evidence vs response-format engagement

This is a **pedagogical decision contract**, not a background algorithm or an inference about why a particular learner skipped an answer. A requested reading, game, microphone, text-only or visual mode overrides any previous preference.

## Distinguish four independent facts

1. **Task outcome:** correct / partial / needs_support / not_assessed, only from trusted rubric and actual response.
2. **Skill evidence:** comprehension, supported recognition, independent production and transfer. Missing answers cannot prove either success or inability.
3. **Format engagement:** a learner chose to attempt, revise or omit this *specific input format* (text area, image label, multiple-choice, game, Voice). A repeated omission signals only that the format was not completed.
4. **Reason:** ONLY a learner's explicit explanation or a confirmed tool/accessibility error can justify a cause. Otherwise keep `skip_reason=unknown`. A stated deliberate skip is `learner_declared`; do not assume anxiety, poor proficiency, boredom or incapacity.

## Fast adaptive policy for recurring skips

- First skip: grade `not_assessed` and maintain current can-do difficulty; avoid punitive correctness percentages.
- Two repeated skips of the same *response format* in verified recent sessions: vary the **mechanic** in the next lesson rather than merely moving the same free-writing textarea toward the start. Offer a 3–8-word opt-in micro-response in a new context; also offer a picture-based decision, guided repair, click ordering or matching. Do not replace the whole lesson with multiple-choice.
- If the learner **explicitly states they intentionally skipped writing**, classify the preference statement as an explicit format preference, not as evidence of an English deficit. Ask about an alternative **only if needed**; otherwise select the next working interactive game/recognition mode with an optional brief independent task. Do not force an identical textarea in every successor lesson.
- When independent writing is skipped, writing mastery stays **unassessed for that task**. Guided reconstruction may show a supported step toward the can-do, but never credits independent writing.
- Offer independent writing again after a rotation or when the learner requests it, in a distinct realistic mini-mission and with a clear reason. Let learner finish early; never block Submit because of blanks.
- Only raise difficulty for well-supported **independent** successes across contexts; never lower difficulty because of skipped tasks alone. Repeated independent errors may trigger scaffolding by the existing competency-specific policy.
- Do not over-adapt to one unusual session or convert ephemeral UI interaction counts into persistent diagnostic labels without consent, trustworthy observation and an explicit privacy-safe storage field.
- Keep learning outcomes honest: distinguish format adaptation ("next game instead of textarea") from skill acquisition ("can now write alone").

## Example decision

After 6 omitted long writeups but 24 correct constrained answers, the next lesson should NOT say "you struggle with writing". Instead: "reading/recognition performed correctly in these tasks; independent writing remains unassessed." Offer a scene-based mini-game and one optional 3–8-word original question, with normal Submit/skip. Follow up with separate independent writing assessment only when attempted; do not count this as CEFR growth.

## Release scenarios

- Explicit deliberate skip => `not_assessed`, no difficulty decrease, alternative response mechanic.
- Two unprompted blank answers => `not_assessed`, reason `unknown`, no psychological inference.
- Independent wrong answer => `needs_support` when rubric warrants, true competency-based scaffolding.
- Correct guided sentence assembly => at most `supported` production/interactivity; no CEFR independent credit.
- A new independent transfer success in changed context => possible skill-confidence improvement (not guaranteed CEFR level).
