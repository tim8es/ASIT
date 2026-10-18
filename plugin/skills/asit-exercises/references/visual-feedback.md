# ASIT feedback and responsiveness — v0.3.6

**Authority:** [UI contract](ui-contract.md). Load only when rendering a structured native UI. Select useful visuals on pedagogical grounds, not quotas. For natural text and reading an SVG scene is not required. For visual-spatial tasks actual image or diagram evidence must be necessary to solve the question.

- Controlled finite choice/fully specified order: no verdict before attempt; after input display provisional `Correct` or `Incorrect — Try again` without revealing the solution or eliminating options. If explanation could solve another task, defer it. For ambiguous lexical spellings, synonyms and free responses: `Review after Submit`.
- Preserve first response as unverified provisional metadata and do not erase it on retry, Replay or changing Cards/All. Client UI can suggest, not certify, independent learning.
- Native controls show real selected/current state, typed text, Undo for ordering and a single final Submit. Early completion from any card uses a *real* confirmation with `X answered / Y skipped` and a path back to lesson.
- A picture next to an answer field must have verified provenance and not disclose a target word in a caption/alt. A sourced static image is not animation. No imaginary Play, Record or hotspot button; ELLLO original page + authenticated audio questions + hearing self-report, else reading/not_assessed.
- Pre-render: explicitly audit each finite key against the actual control option-value domain, each conditional verdict against the intended answer, each button callback against visible state and every Submit payload against actual registered task IDs. Check desktop/mobile host separately.
