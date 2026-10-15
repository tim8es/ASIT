# Start ASIT in a normal ChatGPT chat

**The entrypoint for trying ASIT MLP is [CHATGPT-PROJECT-INSTRUCTIONS.md](CHATGPT-PROJECT-INSTRUCTIONS.md).**

## Installation for a new learner

1. Create a ChatGPT Project for learning English. Paste the entire MLP instruction file into its Project instructions (this is the only manual source-copying step).
2. If you want progress to persist, connect Google Drive in ChatGPT. Do not manually create or edit a workbook.
3. Start a **new normal chat inside that Project** and say **"Start my English program"** or **"Let's do a 5-minute speaking lesson."**
4. Answer one goal question if prompted; practice. If storage is available, approve the privacy mode before the agent saves any record.
5. Continue in a second Project chat to test whether the same state, priorities and previous attempt are retrieved.

**Do not attach your personal workbook to a public issue or copy personal answers into this repository.**

## What to expect

ASIT should ask only relevant questions, use English quickly, generate purposeful interactive exercises and use short targeted corrective feedback. It should offer a real plan, not just a list of generic grammar topics. Skill progress must rely on actual attempts; unobserved skills remain unassessed.

## When to report an issue

Use the fictional test matrix in [MLP acceptance](../docs/MLP-ACCEPTANCE.md). If ChatGPT cannot create a Google Sheet or show native controls, include **only** the feature limitation, client type and redacted reproduction steps—no real response text, Drive URL or token. You can continue learning in temporary mode.

## For developers

This repo's Node.js modules are deterministic *reference logic and tests*. They are not loaded into the ordinary ChatGPT runtime merely because the repo exists. The **install instructions** carry the deployable behavior; the connected Google Drive tools carry persistence.
