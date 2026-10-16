# ASIT exercise registry — 18 types (adapted from ui/patterns.json v0.6)

| Type | Operation / intended evidence | Typical native control | Restriction |
|---|---|---|---|
| `cloze` | retrieval of form in context | typed field | accepted natural alternatives, no answer leak |
| `vocabulary_retrieval` | useful chunks from memory | typed text | context/meaning, not token exactness |
| `image_label` | written word prompted by real picture | image + text directly under | must be real picture, honest text fallback |
| `grammar_contrast` | recognize intended grammar meaning | multiple choice + optional reason | not productive fluency |
| `matching` | associate word/meaning/context | selects or coded pairs | don't fake drag |
| `image_choice` | visual recognition | real image + labelled choices | distinguishable options/alt |
| `image_hotspot` | find an actual object/region | actionable semantic regions | keyboard accessible, no static-image fake |
| `reading_comprehension` | short textual gist/details | visible passage + questions | reading only |
| `sentence_builder` | guided semantic-chunk sentence | chunk selection/order | chunk vs word cards |
| `error_detective` | notice/fix contextual error | rewrite field | independent example useful |
| `card_ordering` | ordered **individual words** | click-to-order + Undo | every required token used |
| `timeline_ordering` | reconstruct story chronology | order 3–5 event cards | evidence of sequence, ambiguous ties deferred |
| `free_production` | independent writing/explanation | textarea | typed only unless genuine speech |
| `scenario` | realistic decision + justification | choice and/or open field | required explanation if rubric says so |
| `dialogue` | context-responsive exchange | real multi-turn chat | 2+ learner turns |
| `spoken_response` | actual spoken production | native Voice/audio if accessible | no pronunciation from transcript |
| `listening` | comprehension of heard real audio | verified audio link + gist/detail | actual sound and confirmation |
| `progress_explorer` | verified historical evidence viewer | filters/read-only summary | not a graded exercise |

These are **17 exercises + one read-only viewer**. The current ChatGPT client may not support every mechanical input. Select a truthful fallback if missing rather than announcing the feature as used.

Selection priority: learner action (`remember`, `recognize`, `read`, `build`, `explain`, `apply`, `interact`, `speak`, `listen`) → operation/modality → available capabilities → useful format variety. Learner-requested standalone exercises can bypass the complete 7-minute lesson template while retaining rubrics and privacy constraints.
