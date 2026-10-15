# ASIT Minimum Lovable Product (MLP) candidate

**Purpose:** a first five minutes that feel like learning from a competent personal teacher, followed by a genuinely useful next visit.

## Included in this candidate

- Self-contained ChatGPT Project instruction, with no fixed biography or level.
- Adaptive goal discovery and CEFR-oriented can-do progression; provisional diagnostic, rolling plan, concise reviews.
- Purposeful native interface patterns and conversational fallback.
- Structured interactive submission, observable rubrics, modality-aware assessment and selective correction.
- Private Google Sheets v2 schema, consent-aware startup, testable persistence/readback, and strict cross-chat state hydration.
- Synthetic end-to-end reference tests, security scans and a learner acceptance script.

## Limitations, disclosed

- The Node.js logic is **reference code** and is not automatically executed by ChatGPT. The ordinary chat's agent follows the self-contained teacher instructions and uses available connectors.
- Native UI, audio, scheduling and Google Drive actions differ across ChatGPT clients and entitlements. No custom frontend or hosted API is bundled.
- Google Sheets lookup-and-append cannot guarantee transactional exactly-once under concurrent writers.
- Human first-run, complete multi-activity lesson, and fresh-chat restoration in the actual client are still to be verified in the acceptance test.
- **Public release is blocked:** an old detached Git object in the original repository was still retrievable by SHA. Keep this repo private until an authorized GitHub purge or new clean repository migration.

## Gate definition

**MLP candidate:** ready for private user testing without manual file setup.
**MLP accepted:** new user passes A–D of [acceptance](MLP-ACCEPTANCE.md) and blockers are repaired.
**Public release:** also requires clearing the Git history privacy blocker and a complete independent review.
