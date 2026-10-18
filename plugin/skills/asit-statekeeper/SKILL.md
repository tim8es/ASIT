---
name: asit-statekeeper
description: "Thin state handoff for ASIT lessons, resumes and scored submissions; delegates all Sheets write rules to asit-progress."
---

# ASIT Statekeeper — state handoff (v0.3.10)

Statekeeper is a **model-followed coordinator**, not a database, cache, runtime hook or second persistence implementation. Invoke for complete lesson/resume, submitted ASIT protocol, or explicitly requested progress. Skip for casual corrections and explanations not connected to a stored ASIT Activity.

1. **Resolve bounded state:** when an authorized Google Drive/Sheets connector is available, locate the unique learner-owned ASIT workbook and verify usable identity, current consent/Config, relevant Goals/Plans, latest Session, due Reviews, relevant Competencies and 3–6 scoped Attempts. Do not infer cross-chat state from chat memory or filename alone. If access is unavailable, do not fabricate state.
2. **Hand off a compact snapshot** to `asit-core`/lesson planner: verified preferences and evidence, consent mode, source IDs, revision and any blocked prerequisites. Respect the learner's current request above default plans. Do not repeatedly rediscover the same verified facts within a turn.
3. **Before a scored stored lesson:** delegate registration and exact Activity readback to [the sole Save Gate](../asit-progress/references/storage-v2.md). Active verified consent (`summary_only|raw`) implies SAVE-REQUIRED; failure is a blocking state, not permission to downgrade silently. Offline learning requires `off` or the learner's explicit choice after failure.
4. **After Submit:** hand the trusted original blueprint and original Activity receipts to `asit-assessment`; it grades and delegates safe persistence to `asit-progress`. Do not perform competing writes, create retrospective Activities or claim provider readback from a chat Submit.
5. **For a successor:** a previous verified Attempt is not enough; independently preregister/read back successor Activities if saving is active. If blocked, give feedback and the correct storage status, then a recovery/offline choice, not an unregistered scored lesson.

The canonical storage policy owns statuses, consent, schema, idempotency, recovery and projection details. `ASIT_ATTEMPT_V2` and nine-tab v2 remain unchanged. Never claim guaranteed exactly-once persistence: Google Sheets operations are not transactional.
