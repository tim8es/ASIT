---
name: asit-progress
description: "Sole implementation policy for consented ASIT Google Sheets storage, truthful save receipts, progress and evidence-based CEFR reporting."
---

# ASIT progress — single persistence owner (v0.3.10)

This is a **skills-only** provider workflow. No bundled backend, OAuth grant, background hook, transaction or client-local persistence. Only authorized Google Sheets/Drive connector calls with an identified learner-owned workbook can save results.

## Conditional routes

- **Trusted scored ASIT lesson before display or after Submit:** read and perform the canonical [storage-v2 Save Gate](references/storage-v2.md). Its state transition table is the single authority for active-consent failure behavior. Never silently switch an enabled `summary_only|raw` workbook to unsaved practice.
- **Resume:** bounded Config, current Goals/Plans, latest Session, due Reviews, related Competencies and 3–6 scoped Attempts. Verify current consent and revision. No guesswork from chat history or workbook title alone.
- **Explicit setup/enable/pause/export:** read [storage setup](references/storage-setup.md), obtain required approval and validate the unique workbook. Google Drive app connection and ASIT privacy mode are separate.
- **Historical progress or CEFR:** consult [CEFR analytics](references/cefr-analytics.md) only when needed; [evidence compatibility](references/evidence-compatibility.md) for grading-to-competency projections; [evidence review](references/evidence-review.md) when scheduling a review. Never claim overall CEFR from incomplete dimensions.

## Never relax these invariants

Consent modes `off|summary_only|raw`, separate `audio_consent`, immutable Activities/Attempts, stable per-task IDs, true privacy-safe summaries, full exact readback and dependency-ordered projections. A duplicate or uncertain provider result must be checked by ID before retry; Google Sheets is nontransactional. Only verified Attempt/projection reads support `Fully synced`; retain truthful partial/unknown states. Unassessed skills remain unassessed, not failures.

Nine exact v2 **data** tabs and seven required Config keys remain unchanged. No mandatory extra tabs, MCP or new columns. Optional user-facing dashboards/docs, if separately approved, must not become part of the nine-tab storage contract. When save is off, normal learning continues honestly unsaved; when an already-active SAVE-REQUIRED write fails, offer retry/repair or explicit offline practice rather than auto-downgrading.
