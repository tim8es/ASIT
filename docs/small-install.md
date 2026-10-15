# Installation profiles

ASIT is not a SaaS with a separate login. It is a reusable agent instruction set operating in ChatGPT.

## Simplest: one ChatGPT Project + Google Drive

1. Copy \`install/CHATGPT-PROJECT-INSTRUCTIONS.md\` into your ChatGPT Project instructions.
2. Connect Google Drive to ChatGPT if cloud persistence is desired.
3. In a **normal chat in that Project**, say "Start my English program."
4. The agent must request consent before creating a private workbook. It asks for meaningful learning goals and begins diagnosis. There is no manual curriculum configuration.
5. The next chat in the same Project uses the user-owned workbook rather than a new one, if connected tools remain available.

Other files in this repo provide more detail and should be read by agents/developers where available. The copy-paste instructions are deliberately **self-contained for basic behavior**, but require the template blueprint \`templates/tracker-v2.json\` for creating the exact storage schema. Users can supply that file if the assistant cannot access GitHub.

## Ephemeral setup with zero external services

Copy the instructions into a normal ChatGPT conversation. Teach via text/native widgets in this chat, but clearly warn that cloud progress persistence and cross-chat continuity are disabled. Export progress manually if wanted.

## Optional advanced setup

Connected GitHub for automatic specification retrieval, scheduled tasks for reminders, or an alternative transactional database may be useful to advanced users, but none is a default dependency for an English-learning session.

## Important

Native Intelligent UI, connector calls and Scheduled Tasks are platform features, not executable JavaScript bundled with this repository. An ordinary user's copy of source code alone cannot install capabilities missing from their ChatGPT account.
