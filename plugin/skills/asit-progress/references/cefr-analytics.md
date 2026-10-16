# CEFR Evidence Analytics — ASIT v0.2.1 (lazily loaded)

Use ONLY when a learner asks for CEFR/level/overall skill progress, diagnostic, or when an assessed Activity is being explicitly tagged with CEFR evidence. Do not load this on ordinary brief vocabulary questions. This is a Skills-only **procedure**, not an executing script or certified examination. The repo `src/cefr-analytics.mjs` is an offline deterministic reference/test oracle; no MCP, external API, or database is required. Google Sheets v2 remains the only optional persistent store.

Official basis: Council of Europe, *CEFR Companion Volume* (2020), https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors . Do not invent or reproduce official descriptor IDs, quote a nonverified descriptor, or present generic skill labels as calibrated CEFR levels. CEFR uses action-oriented can-do descriptors, with distinct comprehension, production, interaction and mediation dimensions.

## Two independent axes — do not conflate

1. **Task demand**: exact targeted CEFR level `A1|A2|B1|B2|C1|C2` on a specific relevant can-do criterion from a real official descriptor; `A2-B1` or vague `B1-ish` are contextual range labels **not eligible** for a level indicator until reviewed/mapped to an exact target.
2. **Observed mastery status**: `unassessed`, `emerging`, `supported`, `independent`, `transferable` from actual tasks and saved evidence. A B1-targeted independent answer means evidence for *that can-do*, not a verified B1 learner.

Preserve baseline assessment categories `correct|partial|needs_support|not_assessed`. Hints, retries, modality, communicative operation, sessions and distinct contexts qualify evidence. A later unaided failure can reduce the current status without deleting earlier attempts.

## Required rubric before CEFR-scored tasks

The **trusted** Activity `rubric_json` (or in-chat trusted Activity if working unsaved) may contain the **optional** object below; it does not alter nine-tab v2 columns:

```json
{"cefr":{"level":"B1","dimension":"writing","descriptor_ref":"source-grounded reference to the exact CEFR descriptor/scale","source":"Council of Europe CEFR Companion Volume 2020","observable_criteria":["Specific observable success criterion"]}}
```

The descriptor_ref above is illustrative: never store that literal placeholder as a verified descriptor. Require a genuine, identified official source/descriptor and concrete task criteria, plus competency can-do, allowed answer variants, help level, `required_modality`, `required_operation`, and observed activity context. Do not attach a fabricated CEFR target to an existing attempt after grading. If official matching is not verified, report `alignment_unverified`; let generic formative assessment proceed without CEFR certification.

Map **only actual observed** modality+operation pairs:

| Required / observed modality | Operation | CEFR dimension |
|---|---|---|
| `reading_text` | `comprehension` | reading |
| `audio_comprehension` | `comprehension` | listening, only if actual audio heard |
| `typed_text` | `production` | writing |
| `typed_text` | `interaction` | written interaction, *not spoken interaction* |
| `spoken_audio` | `production` | spoken production, only if actual learner audio assessed |
| `spoken_audio` | `interaction` | spoken interaction, only if real multi-turn audio occurred |

Recognition and `unknown` operations cannot count as independent productive skill. Text scripts cannot evidence listening, and typed messages cannot evidence speaking/pronunciation. Mediation and phonological competence may be assessed separately with genuine appropriate evidence; they have no automatic result in this v1 report.

## Evidence aggregation (bounded scope and strict safeguards)

1. Ask only for the evidence necessary to answer. Returning learner: scoped Config revision, Competencies, relevant Activities/rubrics, and 3–6 recent Attempts for everyday planning. For a **historical CEFR report**, page all relevant Attempts and Activities from the consented private workbook with explicit scope and record completeness. If only a subset was read, label report **partial**, not complete. No workbook? use current-chat responses and clearly label **temporary / not saved**.
2. Use exact CEFR level on `Competencies.cefr_reference` and matching verified `Activities.rubric_json.cefr` target (same level, dimension and competency). Generic level ranges, unknown descriptor provenance, absent rubrics, unknown modality or wrong operation are excluded from **level inference**, while still shown as ordinary learning evidence. Do not infer a descriptor from language in the answer alone.
3. For each aligned can-do, use only valid matching Attempts: `correct|partial|needs_support`, original trusted Activity, help level, observed modality and operation, distinct context and session. Existing ASIT status rules apply: one unaided correct attempt can be `independent`, while `transferable` needs >=2 unaided successes across >=2 different contexts and >=2 sessions, with no more recent unaided failure. Preserve contradictory history.
4. **Internal level indicator threshold** (an ASIT product heuristic, not the Council of Europe's calibration): for a dimension AND an exact level, at least **3 distinct mapped can-do competencies**, **2** with `independent` or `transferable` status, **1** with `transferable`, and evidence from at least **2 sessions**. Before this, show `insufficient_evidence` (or `not_mapped`), **not** a level.
5. A dimension's *provisional indicative level* is the highest exact level satisfying that threshold, with separate disclosed gaps at lower levels; do not equate higher-level evidence with automatically passing all lower levels. Overall ASIT indicator only if each of five core dimensions (reading, listening, writing, spoken production, spoken interaction) has qualifying evidence; use the lowest of their indicative levels and explain missing domains. Written interaction is separate, and unassessed areas remain visible.
6. Any language proficiency claim must say **"ASIT provisional CEFR evidence indicator; not an official test or certificate"**. Do not emit precise success probabilities, pseudo-percent mastery, unexplained global score, oral speed, or phonology from typed text. Distinguish *scope completeness*, *evidence count*, *skill-status confidence*, and *official certification*.

## Learner-facing report contract

Show an accessible compact table with **Dimension**, **ASIT indicative CEFR level or `not assessed`**, **independent/transferable evidence**, **coverage gap/next assessment**; include an overall indication **only when all five core dimensions qualify**. Show `B1 (provisional)` rather than `B1 certified`. Give 1–2 recent actual observations and next targeted diagnostic task/review. A level is never fabricated from completion counts or a few multiple-choice questions. If raw history isn't fully read, mark `partial report` and its timeframe rather than implying total coverage. Avoid fake bars resembling CEFR score percentages.

## Saving without schema migration

Existing v2 sheets contain `Competencies.cefr_reference`, `required_modality`, `required_operation`, `Activities.rubric_json`, and scoped Attempts. Use these; no new Google Sheets tabs or columns and no MCP. Persist a trusted Activity **before** presenting storage-backed tasks and read it back, then grade and save an Attempt with consent and readback. If the user's store is legacy or has no verified descriptor annotations, progressively tag **new** activities without rewriting historical evidence or announcing an invented CEFR level. CEFR analytics can be computed on demand; do not store fabricated certification status.
