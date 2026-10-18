# ASIT v0.3.2 multimodal lesson release checklist

This is a **manual and model-executed dogfooding contract**, not an executable UI or a claim that embedded audio exists.

| Scenario | Required outcome | Reject when |
|---|---|---|
| 7-min picture vocabulary | 16:9 cover if renderable; two actual image-dependent questions testing different operations; <=2 radios; >=3 input patterns; one original micro-answer early after repeated skips | A plain icon/text timetable is scored as image recognition, or original task simply copies a model |
| 40-min general English | 4–6 phases; >=5 operations; <=35% single-choice; assess authentic audio suitability before blueprint; original short communication; no three same operations consecutively | 15/30 radios, no source check, or same five exercise types multiplied sixfold |
| Validated ELLLO listening | Exact original source page and actual bounded audio/video; plausible duration; scoped clip and evidence-based gist/detail keys; embedded original link beside questions; `heard / transcript / could not hear` report | A footer link, page-wide quiz, unverified clip length, fake Play button or credit for reading alone |
| Media unavailable | Explicit text/graphic substitute with correctly changed modality and rubric before registration; no `listening` or `image_choice` claim | Audio task auto-replaced with reading but tagged listening; incorrect CEFR confidence |
| Repeated skipped independent writing | One early 3–8-word original situational request, clear recipient and outcome; no copyable lead-in; other operations varied | Same long textarea moved from last to second position |
| State and lesson flow | Cards/All keeps data, no pre-answer solutions, Undo/Reset working, one canonical Submit, early-submit confirmation and `not_assessed` for blanks; Save Gate Activities read back before lesson | Writes after display, raw learner text stored under `summary_only`, local badge counted as durable grade |
| Honest interactive media | Real host controls only. Genuine dialogue requires multiple learner turns or Voice. No pretend animation/hotspot/mic | Decorative speech bubble, inert drag widget or icon called a full image |

## Release regression

1. Test source selection before task plan using a 40-minute request, not after constructing text quizzes.
2. Inspect the *actual final prompt and image alt*, not just Activity rubric, for answer leaks.
3. Reproduce the 30-task repetitive lesson as a negative test; it must fail task-balance and media preflight.
4. Keep existing privacy, Sessions, Config revision, exact-ID dedupe and CEFR protection unchanged.
