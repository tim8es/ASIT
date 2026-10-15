# ASIT runtime installation architecture

Separate three concerns:

| Destination | File / service | Purpose |
| --- | --- | --- |
| ChatGPT Project Instructions | [PROJECT-ROUTER.md](../install/PROJECT-ROUTER.md) | Small always-on role, source-loading and consent guard |
| ChatGPT Project Files / Knowledge | [ASIT-ENGINE.md](../install/ASIT-ENGINE.md) | Universal teaching and evaluation rules, without storage schema |
| ChatGPT Project Files / Knowledge | [ASIT-STORAGE.md](../install/ASIT-STORAGE.md) | Exact storage protocol, loaded only when needed |
| Private learner-owned Google Drive (optional) | ASIT — Learner State | Personal goals, competencies, attempts, reviews and plans |

The project source is versioned in GitHub; it is **not** automatically executable JavaScript and does not automatically sync into Project Files.

**Install:** download the engine and storage adapter files, upload both to Project Files, paste the router only into Project Instructions, open a new chat inside the Project, then start the course. The router should read the engine before teaching and inspect only relevant private learner records. If it cannot actually open the engine, it must report that and request the file.

**Privacy:** personal data is never committed to GitHub. Before writing new data to Google Sheets, obtain informed consent; verify any write by readback. Without Google Drive, use unsaved mode. Without working native UI controls, use ordinary chat responses.

**Release:** the original GitHub repository remains private until its detached old objects have been dealt with. Users may test locally without making it public.
