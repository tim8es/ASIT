# Architecture v0.2 — native ChatGPT, private learner store

\`\`\`text
Ordinary ChatGPT conversation (teacher + native Intelligent UI)
           |                    ^
       controlled submit    feedback / retry
           v                    |
   ASIT_ATTEMPT_V2 → assistant validation → assessment
           |                         |
           +----------> adapter / private Google Sheet
                                      |
                       Profile, Goals, Competencies, Plan
                       Lessons, Attempts, Review, Sessions
\`\`\`

The source repository contains reusable skill prompts, specs, evals and optional deterministic reference helpers. These Node.js files are **not automatically executed by ChatGPT**: the model uses the portable contracts and connector actions. Native UI is server/client-rendered inside ChatGPT; it isn't this repository's React app.

## Separation

1. **System specifications** (GitHub): generalized teacher rules, strategies, evidence rubric, UI patterns, empty data contracts, anonymized demos. Revisions are versioned.
2. **Learner state** (private Google Sheets, user-owned): preferences, goals, skill graph, lesson state, responses if consented, review timings and provenance. No defaults copied from project author.
3. **Chat context**: transient conversation, activity widgets, text and user decisions.
4. **Storage adapter**: reads/writes bounded ranges through connected Google Drive. Never let browser UI call arbitrary endpoints or take over credentials.
5. **Optional future services**: add only after native limitations are reproducibly measured (e.g. stronger concurrent writes, asynchronous prep, actual audio tooling).

## Guarantees and limitations

- A native widget sends a new chat turn, not direct persistent write.
- Cross-chat continuity requires installed project instructions and accessible user-owned private state. Unconfigured chats do not magically preload GitHub content.
- Google Sheets is nontransactional for read-before-append; duplicate prevention is best effort. Do not promise multi-user concurrency correctness.
- No independent diagnostic test can accurately yield one precise CEFR level from a few short answers. Record uncertainty and modality distinctions.
- No independent background lesson preparation unless a configured task actually has permitted access to the needed state.
- No private links or learner data in source or CI.

## Migration

Public v0.2 schema is clean and individualized; legacy pilot tracking uses separate skills/attempt columns. See \`docs/tracker-contract.md\` for opt-in coexistence/migration. Do not perform destructive migrations on anyone's existing workbook.
