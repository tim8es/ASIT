# ASIT competency evidence compatibility — Sheets v2 bridge

Existing v2 Google Sheets `Competencies.required_modality` / `required_operation` describe broad **learning evidence dimensions**. `Attempts.observed_modality` / `observed_operation` describe the specific task. Comparing the strings **literally** silently loses compatible evidence. Conversely, treating every correct result as independent inflates mastery.

**Use conservative normalization, not string equality or unconditional equivalence.** The repository's standard-library helper `plugin/scripts/lesson_contract.py::evidence_compatibility` is a **development oracle, not an ASIT runtime module**. At teaching time apply this table conceptually only after trusted Activity + exact Attempt readback; ambiguous cases remain excluded.

| Required Sheets v2 competency | Eligible attempted observation | Competency evidence ceiling |
|---|---|---|
| `text_or_visual / recognition` | `visual / image_scene_recognition`, `visual / image_object_recognition`, actual image-noun retrieval | **supported**; no claim of independent communication |
| `reading / comprehension` | `reading / reading_inference`, `reading / textual_inference`, `reading / reading_comprehension` | **independent possible** only for unaided valid comprehension in a distinct task; transfer needs cross-context |
| `writing / interaction` | `writing / independent_production` with actual recipient, communicative function and trusted semantic rubric | **independent possible** when unaided and correct |
| `writing / interaction` | `writing / guided_chunk_order`, `writing / sentence_builder` | **supported only**; guided selection is not unaided interaction |
| `writing / production` | `writing / independent_production` | **independent possible** when unaided and correct |
| `typed_text / guided_construction` | `writing / guided_chunk_order` | **supported only** |
| `listening / comprehension` | Verified real heard audio and `listening / audio_comprehension` plus learner hearing report | **independent provisional only when original audio was actually heard** |
| `speaking / interaction` | Real voice session with observed oral interaction | **independent possible**; typed text excluded |

Additional safeguards:
- `not_assessed` => **no proficiency evidence and no invented review**; in particular a deliberately skipped question means **not tested**, never `needs_support`.
- Recognition, symbolic diagrams, assembly, typed writing, audio transcripts and genuine speech are **not interchangeable modalities**.
- Normalize task-specific names to broad families `recognition`, `comprehension`, `guided_construction`, `independent_production`, `lexical_retrieval`; task type/UI is a **separate axis**, not the proficiency operation.
- Unknown modality / operation / rubric => exclude from independent status and flag for review, do not invent aliases to make charts greener.
- `correct` with no hints permits independent status only for a matched independent task; `correct` on a guided or recognition item tops out at **supported**. `partial` supports at most supported; `needs_support` cannot raise status.
- `transferable` additionally requires >=2 correct unaided attempts in >=2 distinct sessions **and** >=2 contexts with compatible semantics and no more recent unaided failure; do not infer it from one lesson's multiple items.
- A **CEFR level** requires exact source-verified descriptor mapping *at task registration* and dimension coverage. This mapping alone never awards a CEFR level.

## Migration and projections

**Do not mutate historical Activity/Attempt rubrics or past scores** to make data fit this table. Existing `Attempts` rows remain immutable. At the next authorized projection/reconciliation read, derive cautious status from trusted Activities + compatible observed fields, retain mismatches/exclusions and corrections, then write/readback projections only with verified consent, revision and ID checks. Keep the nine-tab schema unchanged. An actual Sheets mutation must verify its own readback; changing this document does not update a private workbook.

For future rubric JSON include `assessed_skill`, `evidence_family`, `observed_operation`, `support_level`, `response_control`, `source_evidence` as separate concepts. They may live as keys in the existing `rubric_json`, not new columns. A composite Submit still creates one Attempt per graded subtask.
