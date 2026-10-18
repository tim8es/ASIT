# ASIT competency evidence compatibility — Sheets v2 bridge

Existing v2 Google Sheets `Competencies.required_modality` / `required_operation` describe broad **learning evidence dimensions**. `Attempts.observed_modality` / `observed_operation` describe the specific task. Comparing the strings **literally** silently loses compatible evidence. Conversely, treating every correct result as independent inflates mastery.

**Use conservative normalization, not string equality or unconditional equivalence.** Eligibility requires a provider-readback-verified original Activity/rubric and relevant observed response evidence. A final `correct` after instant UI feedback does **not** by itself prove the first try was unaided. The repository's standard-library helper `plugin/scripts/lesson_contract.py::evidence_compatibility` is a **development oracle, not an ASIT runtime module**. At teaching time apply this table conceptually only after trusted Activity + exact Attempt readback; ambiguous cases remain excluded.

| Required Sheets v2 competency | Eligible attempted observation | Competency evidence ceiling |
|---|---|---|
| `text_or_visual / recognition` | `visual / image_scene_recognition`, `visual / image_object_recognition`, actual image-noun retrieval | **supported**; no claim of independent communication |
| `text_or_visual / recognition` | *Actually displayed* `visual_symbols / visual_symbolic_spatial_prediction`, `diagram_object_tracking`, `diagram_scene_comparison`, `diagram_object_label` | **supported only**, and only with confirmed diagram visibility; never a real-photo or independent language claim |
| `reading / comprehension` | `reading / reading_inference`, `reading / textual_inference`, `reading / reading_comprehension` | **independent possible** only if the *first unaided response* was reliably observed and the rubric was verified; otherwise supported |
| `writing / interaction` | `writing / independent_production` with a verified recipient/communicative goal **and verified semantic review** | **independent possible** only with verified unaided first attempt; otherwise supported |
| `writing / interaction` | `writing / guided_chunk_order`, `writing / sentence_builder` | **supported only**; guided selection is not unaided interaction |
| `writing / production` | `writing / independent_production` | **independent possible** when unaided and correct |
| `typed_text / guided_construction` | `writing / guided_chunk_order` | **supported only** |
| `listening / comprehension` | Verified original audio, actual `audio_comprehension` task **and** learner hearing report | **otherwise excluded**; reading transcript with audio evidence may yield supported only |
| `speaking / interaction` | Verified actual spoken answer in Voice and >=2 oral interaction turns | **otherwise excluded**; typed text and an unverified correct flag do not count |

Additional safeguards:
- `not_assessed` => **no proficiency evidence and no invented review**; in particular a deliberately skipped question means **not tested**, never `needs_support`.
- Recognition, symbolic diagrams, assembly, typed writing, audio transcripts and genuine speech are **not interchangeable modalities**.
- Normalize task-specific names to broad families `recognition`, `comprehension`, `guided_construction`, `independent_production`, `lexical_retrieval`; task type/UI is a **separate axis**, not the proficiency operation.
- Unknown modality / operation / rubric => exclude from independent status and flag for review, do not invent aliases to make charts greener.
- `correct` with no hints **alone is insufficient** for independent status: require a verified rubric, verified unaided first attempt and task-appropriate semantic/comprehension review. A client-local first-answer field with `ui_provenance=unverified` is NOT verification. Guided or recognition tasks top out at **supported**. `partial` supports at most supported; `needs_support` cannot raise status.
- `transferable` additionally requires >=2 correct unaided attempts in >=2 distinct sessions **and** >=2 contexts with compatible semantics and no more recent unaided failure; do not infer it from one lesson's multiple items.
- A **CEFR level** requires exact source-verified descriptor mapping *at task registration* and dimension coverage. This mapping alone never awards a CEFR level.

## Migration and projections

**Do not infer audio/media/Voice verification retroactively from task labels. The offline helper requires explicit trusted evidence flags; it is not itself capable of authenticating those flags or writing Google Sheets.**

**Do not mutate historical Activity/Attempt rubrics or past scores** to make data fit this table. Existing `Attempts` rows remain immutable. At the next authorized projection/reconciliation read, derive cautious status from trusted Activities + compatible observed fields, retain mismatches/exclusions and corrections, then write/readback projections only with verified consent, revision and ID checks. Keep the nine-tab schema unchanged. An actual Sheets mutation must verify its own readback; changing this document does not update a private workbook.

For future rubric JSON include `assessed_skill`, `evidence_family`, `observed_operation`, `support_level`, `response_control`, `source_evidence` as separate concepts. They may live as keys in the existing `rubric_json`, not new columns. A composite Submit still creates one Attempt per graded subtask.
