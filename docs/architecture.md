# Architecture v0.4 — native ChatGPT, private learner store

```text
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
```

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
- No background preparation guarantee without a Scheduled Task actually having permission to access storage; see `docs/scheduling.md`.
- Current Git root is clean, but old detached commits remain addressable by SHA; **publication blocked** until purged or cleanly migrated. See `docs/publication.md`.

## UI Orchestrator: evidence-driven native UX

A compact, reusable decision layer `src/ui-orchestrator.mjs` chooses among meaningful ChatGPT-native activity patterns based on **learning action**, assessment operation, real modality, available input capabilities and recent pattern repetition. Read `ui/UI-ORCHESTRATOR.md` for the small runtime contract. Its recipe index points to lightweight `ui/patterns/*.md` specifications retrieved **only when that pattern is needed**. This is source-controlled generic behavior; learner preferences and task history remain private in Learner State. The reference selector does not itself render UI or call an external app.

A lesson first chooses topic and target grammar/language pattern, then uses the UI Orchestrator to design up to five exercises within seven minutes **by default**; duration and task count come from private learner settings when changed. Missing functional audio/image/sorting capabilities trigger labelled fallbacks; they **never** justify fabricated evidence. Free conversation uses ordinary chat. One coherent form submits all compatible tasks, with feedback on the following turn.

## Legacy state

Historical private v0.1 workbooks can be read with `src/storage-contract.mjs` and migrated only after private backup and verification. Source tree and learner data are permanently separate.

## Source, private adaptation and bounded context

The Project Router is stable and short. The attached `ASIT-ENGINE.md` holds universal teaching policy. `ASIT-STORAGE.md` carries Google Sheets technical fields and is retrieved only during required storage operations. No learner-specific plans, assistance levels, goals, adaptations or error patterns belong in either source file. `Config.adaptive_profile` stores personally derived adjustments with evidence IDs and rationale; Goals, Plans and Reviews are likewise mutable private learner state. The current Session activity is transient until written.

For fast startup read only a few authoritative records; **never run a whole-workbook hydration as the default live connector flow**. See [context audit](CONTEXT-PERFORMANCE.md). The full `hydrateWorkbook` reference helper validates fully supplied v2 data for offline tests, migrations and explicit deep audits; it is not proof that fetching all nine tabs is a suitable everyday user experience.
