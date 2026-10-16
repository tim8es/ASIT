---
name: asit-media
description: "Use automatically whenever an ASIT lesson benefits from short authentic listening, audio or video comprehension, ELLLO, One Minute English, Sound Grammar, hearing grammar in context, or a self-paced Play then Answer exercise."
---

# ELLLO-first real listening/video builder (no MCP)

Use **ELLLO as the preferred first external discovery source** whenever an actual short listening/video segment helps the learner's stated objective. Do not force video into pure reading/writing tasks. The user should not need to search for ELLLO manually. This skill is an **instruction-driven** ChatGPT workflow, not a crawler or downloaded catalog; it works only if current public web search/read is actually available. **Original media stays on ELLLO.**

## Runtime workflow

1. Read the learner's current language objective and **known** level only if observed/stored; no level presumption. Choose collection: `One Minute English` (`elllo.org/video/`) for short authentic video; `Sound Grammar` (`elllo.org/book/`) for hearing a specific construction. Consult [source shortcuts and queries](references/elllo-sources.md), but a seeded URL is a **candidate, not a verified playback-ready card**.
2. Search ELLLO on the live public web if no already vetted suitable candidate exists. Use generic learning words in queries, e.g. `site:elllo.org/video/ travel A2 One Minute English` or `site:elllo.org/book/ present continuous Sound Grammar`. **Never send private learner profile, answers, name or workbook IDs** to public search. Open the exact original page (not merely a search snippet); verify topic, English content, original on-site audio/video and optional script.
3. Choose a **standalone bounded source asset** whose real duration is credibly verified and fits the learner's budget: prefer 15–60 seconds for regular listening, and allow 61–90 seconds for explicit extended practice. Shorter complete clips are fine. **One Minute English** branding is NOT verified duration. Never fake a trim of a 10-minute asset or use an unverified timestamp. Unknown duration → candidate only, find another source or mark listening unavailable. Confirm original on-site media; an HTML player is not proof of mobile audio.
4. For `Sound Grammar`, choose **one specific conversation 1–4** and make sure both transcript excerpt and audibly playable track refer to that same conversation. Do not mix separate dialogues or grade from a page-wide script that includes unplayed material.
5. After reading actual scoped transcript, **author 2–3 original comprehension questions**: gist, concrete detail and optional brief production. Keep a trusted answer key and short evidence anchors for each; verify each question logically follows the selected heard material, not just a title/snippet. Do not copy ELLLO's own full quiz or transcript into the generated card or repository; short source evidence may be used privately to check questions.
6. **Within the actual listening lesson**, place source title, attribution and **link to the original ELLLO lesson page** immediately before native ChatGPT radio/input/textarea gist/detail questions and learner hearing/transcript-use confirmation. Include **one real Submit**. A source link in a footer as optional homework does not satisfy the listening task. Do not fake an embedded video or a native Play control unless this client truly has working media. Hide the transcript and correct answers until after first attempt.
7. When grading, confirm user reports `heard without reading`, `heard with transcript`, or `could not hear`. External hearing is a **learner self-report**, not platform playback telemetry. Failure → listening `not_assessed`, regardless of guessed answers. Transcript-before-answer → `audio_plus_text_supported`; actual self-reported hearing without text can support a cautious provisional comprehension result. See `asit-assessment`.
8. If verified source/media, duration, script or rights don't suffice, try another ELLLO item. If none meets the bar, openly offer reading exercise as **reading**, not "listening passed". Never invent a file URL or media length.

## Consent, rights and speed

Do not download, rip, cache or rehost ELLLO video or whole scripts. Use original-site source links; any new bulk storage or redistribution requires checking and obtaining suitable rights. ELLLO can include text/vocab/quiz for teacher reference, but ASIT's questions should be its own. No cross-chat cache is installed; only temporary reuse within a chat when provenance remains reliable. External search and video performance are not time-guaranteed.

When user prefers **Live Voice** rather than prerecorded clip, route to `asit-voice`. The in-chat form cannot make the ChatGPT microphone or Voice session start. Without actual host media support, external link + native Q&A is the allowed workflow.

See [source index](references/elllo-sources.md) and [audio response contract](references/media-quality.md).
