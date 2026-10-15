# ASIT technical verification — 2026-10-15

**Scope:** engineering verification, **not** a study claiming pedagogical effectiveness.

## Automated results

- [GitHub Actions run](https://github.com/tim8es/ASIT/actions/runs/38774499513): **128 tests passed, 0 failed**.
- Checked strict fresh-chat hydration, native chat lesson lifecycle, simulated complete MLP learning journey, pure learner-state invariants, dependency graph validation, scoped evidence, review scheduling, full-attempt replay guards, summary-only restoration, storage failure, setup templates, synthetic end-to-end transitions and source-safety heuristics.
- HEAD tracked-source scan: passed.
- Reachable Git history scan: passed. This is **not a purge** of detached GitHub commits, caches, PR refs, or third-party clones.

## Connected Google Sheets integration

A disposable native Google Sheet was created for a **synthetic fictional learner**. Its verified lifecycle:

1. Created a blank workbook through the existing connected Drive tooling.
2. Created all **nine v2 tabs** and wrote exact schema headers, including the 17-column Attempts schema. This live smoke test preceded the latest two competency/activity modality fields; those new fields are covered by current code tests but need renewed live user acceptance.
3. Seeded only synthetic configuration keys and fictional learning records (goal, competency, trusted activity, attempt, review and session).
4. Verified the Sheet metadata and individual row readbacks across six data tabs.
5. Searched for the test attempt ID and confirmed **exactly one** matching row, with the privacy-safe summary, observed modality and operation.
6. **Permanently deleted** the disposable QA spreadsheet.

This proves that native Google Drive tools support the particular tested read/write operations. It does **not** prove ChatGPT automatically conducts onboarding across accounts, handles every connector error, or completes a human exercise unassisted.

## Pedagogical evidence boundaries

- A successful choice exercise or typed answer does **not** certify oral production or listening.
- Full B2/CEFR achievement is not inferred from small samples.
- Intervals are explicitly a lightweight review heuristic, **not** an FSRS implementation.
- The system preserves failed attempts and revises a transfer label after fresh contrary evidence; it does not erase history.

## Still requires human acceptance

- A new user opens normal ChatGPT, copies installation instructions, consents, completes diagnosis, and receives a tailored program.
- Multiple native UI interactions, retries, screen-reader/mobile fallback, and storage writes from user clicks.
- Reopening a separate ChatGPT chat and loading precisely the same privately stored state.
- Live audio / voice feature testing where accessible.
- Full privacy release gate, including old disconnected GitHub objects still retrievable by direct SHA.

Do not label these scenarios as complete until directly observed. See [manual acceptance](manual-acceptance.md) and [publication gate](publication.md).

## MLP candidate check

The canonical entrypoint is [one-paste Project instructions](../install/CHATGPT-PROJECT-INSTRUCTIONS.md). An explicit user acceptance sequence is in [MLP acceptance](MLP-ACCEPTANCE.md). Code-level E2E checks simulate a new-chat reload but cannot prove the client actually invokes connected tools across conversations.

## Context audit and modular architecture (2026-10-15 addendum)

The live sources were separated into a small Project Router (1,757 characters), a universal Teaching Engine (6,762 characters), and an on-demand technical Storage Adapter (5,741 characters). Relative to the previous always-read Router+Engine set of 11,159 characters, the new always-read set has 8,519 characters, or **23.7% fewer**. Source size was measured from GitHub Actions, not inferred from model tokens.

The CI context audit benchmarks fictional attempt histories of 0, 50, 500 and 5,000 items: the selected serialized context packets were 839, 2,544, 2,552 and 2,566 characters, respectively. This confirms the **reference packet does not grow linearly with historic attempts**. It does not independently verify that the ChatGPT Google Drive agent will actually perform the intended bounded reads; that remains a human acceptance test. No model token-level counts, connector latencies or mobile UX response times were measured.

The private learner state supports an optional adaptive_profile and evidence-linked decision rationale in Config. This does not require changing the published Sheet tabs. Actual per-user adaptations remain out of GitHub and Project source files.
