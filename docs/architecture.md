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
                       Config, Goals, Competencies, Plans
                       Activities, Attempts, Reviews, Sessions
\`\`\`

The source repository contains reusable skill prompts, specs, evals and optional deterministic reference helpers. These Node.js files are **not automatically executed by ChatGPT**: the model uses the portable contracts and connector actions. Native UI is rendered inside ChatGPT; it isn't this repository's React app.

## Separation

1. **System specifications** (GitHub): generalized teacher rules, strategies, evidence rubrics, UI patterns, empty data contracts, fictional demos. Revisions are versioned.
2. **Learner state** (private Google Sheets, user-owned): preferences, goals, skill graph, lesson state, responses if consented, review timings and provenance. No author defaults.
3. **Chat context**: transient conversation, activity widgets, text and user decisions.
4. **Storage adapter**: reads/writes bounded ranges through connected Google Drive. Never let browser UI call arbitrary endpoints or take over credentials.
5. **Optional future services**: add only after native limitations are reproducibly measured (e.g. stronger concurrent writes, asynchronous prep, actual audio tooling).

## Capabilities and limitations

- A native widget sends a new chat turn, not a direct persistent write.
- Cross-chat continuity requires project instructions and accessible user-owned private state. Unconfigured chats do not magically preload GitHub content.
- Google Sheets is nontransactional for read-before-append; duplicate prevention is best effort, never exactly-once under parallel writers.
- No short independent diagnostic establishes an exact CEFR level; record uncertainty and modality distinctions.
- No background preparation guarantee without a Scheduled Task actually having permission to access storage; see \`docs/scheduling.md\`.
- Current Git root is clean, but old detached commits remain addressable by SHA; **publication blocked** until purged or cleanly migrated. See \`docs/publication.md\`.

## Legacy state

Historical private v0.1 workbooks can be read with \`src/storage-contract.mjs\` and migrated only after private backup and verification. Source tree and learner data are permanently separate.
