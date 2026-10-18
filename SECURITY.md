# Security policy

ASIT is a skills-only learning plugin project that may interact with consented learner data in an external Google Sheets workbook. **Do not publish secrets, private learner content or personal workbook links in GitHub issues, pull requests or discussions.**

## Supported versions

This repository currently contains a **v0.3.0 source candidate**, not a verified public plugin release. No production support or vulnerability response SLA is advertised.

## Reporting a vulnerability

If GitHub's **Report a vulnerability** / private security advisory feature is enabled for this repository, use it. Otherwise, contact the repository maintainers privately via their GitHub profile to arrange a secure channel **before** sharing exploit details or sensitive artifacts.

For ordinary bugs with no private data, use the GitHub issue templates.

## What to include privately

A concise impact description, affected file/version, minimal **sanitized** reproduction steps and a recommended fix, if known. Never send real learner history, credentials, OAuth tokens, Google Sheets IDs or customer information.

## Existing public repository and history warning

This repository is already public. The current tree and passing CI cannot establish the safety of previous commits, detached Git objects, branches, workflow logs, artifacts or PR attachments. A full history/privacy review remains an **open release blocker** (see [issue #1](https://github.com/tim8es/ASIT/issues/1) and [publishing checklist](docs/PUBLISHING.md)). If a credential or learner record was exposed, follow incident response and rotate affected credentials; deleting a file or changing visibility does not undo prior exposure.
