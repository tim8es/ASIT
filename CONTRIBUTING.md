# Contributing to ASIT

ASIT is primarily an **English-teaching specification for ordinary ChatGPT**, plus dependency-free reference logic and synthetic tests. The source must remain generic and privacy-safe.

## Development loop

Install Node.js 22 or later (only needed for development). Run `npm test` and `npm run audit`. No LLM API key, web frontend or hosted service is required.

Before proposing a change:
1. Explain which observable learning or learner experience problem it solves.
2. Preserve first-run individualization: never preset identity, first language, job, proficiency or learning objectives.
3. Add a fictional test covering success, invalid input and, for persistence, no-consent/failure behavior.
4. Validate schema and installer compatibility. If the private store changes, provide a versioned migration plan and no destructive automatic upgrade.
5. Document live vs simulated verification without inflating results.

## Privacy

Never commit actual learner answers, names, contact data, personal Drive file IDs, credentials, recordings or any original screenshot containing such information. Do not put private data in issues, pull requests, workflow logs, fixtures or release notes. Run the audit; remember an automated scan is incomplete.

## Release policy

The original repository currently contains detached historical objects still addressable by old SHA. It stays private until public-history safety is resolved. Refer to `docs/publication.md`. Keep standalone deployment free of a mandatory separate app, custom MCP server and paid API service without reproducible justification.

## Definition of completion

A green test run proves code invariants, not language learning. Native UI rendering, persistence permissions, fresh-chat recovery and real feedback must pass the manual acceptance plan before being called fully verified.
