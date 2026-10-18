# ASIT recognition and retrieval patterns — v0.3.7

Use [UI contract](ui-contract.md) for authoritative controls and feedback. No local hint after an incorrect finite choice beyond neutral `Incorrect — Try again` until final Submit; this prevents answer leakage.

- `cloze`: one real context and a native typed blank; accept natural variants via semantic assessment after Submit when ambiguous.
- `grammar_contrast`: 3–4 plausible alternatives with no stylistic key signals; optional independent why when appropriate; recognition only.
- `matching`: native select/pair assignments with reversible visible state, no fake drag.
- `reading_comprehension`: actually readable continuous passage + gist/detail or inference, not listening; no arbitrary image requirement.
- `image_label`: verified real image immediately above input, no answer in caption/alt/vocabulary, synonyms accepted in trusted rubric; missing picture → change task/modality or `not_assessed`.
- `image_choice`: verified source image with meaningful visual discrimination and controlled selection; source unavailable → honest non-photographic alternative.
- `image_hotspot`: only if true keyboard-accessible actionable semantic regions exist. Static `AsyncImage` ≠ hotspot.
- Finite local feedback appears after attempt; open lexical aliases/free text show `Review after Submit`. Preserve first response as unverified UI metadata only.
