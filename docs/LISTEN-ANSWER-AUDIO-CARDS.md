# Inline Intelligent UI — canonical implementation (v0.2)

**Default is native ChatGPT UI, not a separate HTML lesson.** Learner explicitly rejected the standalone HTML demo and the low-fidelity 22.05 kHz / ~32 kbps synthetic speech as not representative. Do **not** recreate that experience in routine lessons. The audio file itself may require a **minimal inline media adapter** if a genuine playable media surface is supported; only Play/Pause/Replay/speed belong there. All questions, selections, writing, validation, hint exposure, progress and final Submit belong to native Intelligent UI controls (e.g., `radio-group`, `input`, `textarea`, `checkbox`, `button`). Never surround the entire lesson in an AppBlock iframe or use a separate web page as the default.

**Capability truth:** current native DIL has no advertised dedicated `AudioPlayer` component or callback for actual audio playback, so do not pretend a normal DIL button can start an MP3. A small inline audio media adapter can use a valid external audio source in an embedded surface when allowed, with **real client playback QA**. iOS/mobile embedded audio is not guaranteed. If unsupported, offer a verified audio link/attachment while keeping the *questions and Submit native in-chat*; explicitly label whether listening was verified. Do not call a standalone HTML prototype a fully integrated lesson.

**Quality gate:** prefer a real, clearly articulated human recording with attributable permission or high-quality licensed TTS with a natural prosody check. Inspect metadata; flag sample rates below 32 kHz or bitrates below 64 kbps as technical warnings, and require **human listening review** even for high-bitrate assets. Never auto-upsample bad synthesis and claim it sounds natural. Check transcript against actual heard excerpt. Avoid fake "natural voice" claims.

**One visible surface:** title, 20–50 second audio excerpt, actual source/attribution, Play/Replay/speed in media slot; native gist/detail questions, explicit learner confirmation of audible playback, one Submit after required answers, native feedback and transcript only after answer (or mark support if early). If the source fails, record `not_assessed`; do not grade guesses as listening. Distinguish audio-comprehension evidence from mere form completion.

**Responsive/mobile:** one primary question at a time or a short bounded combined form; no deeply nested scrolling, no interstitial browser. Keep 44+ px taps, accessible labels, keyboard fallback and honest streaming/errors. Native DIL interactions must work and retain answers when user retries audio. Host iframe media may fail on iOS; verify on actual client.

See the remaining v0.1 reference contract below for rubric fields, assessment, fallback and consent boundaries.

---

# Listen → Answer audio cards — ASIT v0.1

**Purpose:** a learner taps a **real** playable audio clip in a normal ChatGPT lesson, then answers short gist/detail questions. This is **different from Voice-first dialogue** and doesn't require speaking to the tutor. The UI card can use native controls plus a genuinely supported player. Its model/Node contract does not install an HTML audio bridge.

## Learner flow and design

1. **Listening card:** short title + duration + accessible working `Play` control for an actual original/licensed/approved MP3 or other verified decodable audio asset. A player has an explicit load/error state. `Replay` and optional `0.8×` should be working controls, not icons without an action. Background artwork optional and must not leak scored answers.
2. **Playback gate:** track `canplay / playing / ended / error` events (or equivalent). Do not unlock purported heard comprehension when the clip failed or never finished. Player events are *provisional metadata*; they do not prove human auditory perception. Capture a learner confirmation whether the response relied on the transcript.
3. **Question face:** after an actual playback, show two or three connected questions (gist first, detail second; one free typed detail is useful). Use 2–4 meaningful options or one native input. Do not show the passage transcript or correct answers **before** the first attempt, unless the learner requests a transcript, in which case mark `audio_plus_text_supported` rather than unassisted listening.
4. **One Submit:** check every required question, allow a clearly labeled `Finish early — incomplete` path, send a real chat turn with stable Activity/item IDs and the final answers. Objective options can be checked using the trusted rubric after Submit; free explanations must be reviewed by the assistant. Do not mark a partially filled pack as complete.
5. **Feedback:** identify gist vs detail success, one meaningful misunderstanding, specific evidence from transcript *after* first attempt, replay and optional second attempt. Transcript reveal after review must not retroactively turn the original attempt into text-supported.
6. **Result evidence:** `provisional_heard_comprehension` only when the clip really played through, answers exist, and learner confirms listening without reading; `audio_plus_text_supported` if transcript shown before the response; otherwise `not_assessed`. Distinguish `completed_form` from `listening_skill_assessed`. Replay count and playback speed are task metadata, not proof of listening mastery. Store only after informed consent and verified Drive write/readback.
7. **Audio unavailable:** show a clear error/alternative. An attached audio file that opens only as a separate download does not guarantee *embedded in-chat* playback. If the client cannot play the real clip inline, offer a genuine downloadable attachment or a reading equivalent **with changed modality**, not a silent speaker icon.

## Authoring contract

The trusted Activity (not user-editable form data) specifies:

- `asset_id`, `mime_type`, `duration_seconds`, `uri` or attached media reference, `verified_access`, optionally `copyright/license`; avoid invented or expiring URLs.
- `transcript` held until appropriate reveal, `question_id`, `operation` (`gist`, `detail`, optional `inference`), stable prompt, `type` (`single_choice`, `short_answer`, `free_response`), accepted variants and whether required.
- Supported client playback capability is independently tested; the manifest alone is not capability evidence. Use `src/listen-answer-card.mjs` as a portable reference evaluator.

### Recommended card states

`loading → ready → playing → listened → answering → submitted → reviewed`.

From `loading/playing` on error → `unavailable`, never `completed` or scored as listening. From `listened`, transcript reveal before Submit → `assisted_text`. An explicit skip → `incomplete`. Attempted replay supports `playing` again without erasing written answers.

## Audio generation and in-chat feasibility

For reproducible demonstration, this repository describes a self-contained HTML player using an actual *embedded MP3* (for example generated offline with open-source tools); on an ordinary browser this provides real sound and avoids external API keys. This **does not imply that ChatGPT currently supports arbitrary native HTML audio playback** in all mobile clients. ASIT should use the clip as a verified attachment/link fallback and only show an inline player after QA proves it on the target client.

High-quality production TTS can be generated outside the UI from a real text-to-speech provider (for example the OpenAI Speech API) and delivered as MP3 **with an approved asset-serving mechanism**, but this requires infrastructure, account permissions and possibly cost. Never place API keys in in-chat JavaScript, a public source file or learner storage. User-owned/audio-uploaded legitimate recordings are valid when rights and client access allow it.

**Do not claim that a working standalone HTML prototype has automatically become a native ChatGPT component.** The learner-facing demo is a client QA artifact.

## Sample synthetic exercise

Spoken (do not show before first attempt): "Attention passengers. The train to Brighton departs at nine fifteen from platform four. Please arrive five minutes early."

Questions: (1) Where is the train going? Brighton / Bristol / Leeds. (2) Which platform? 3 / 4 / 5. (3) What time? Accept 9:15, 09:15, nine fifteen.

The bundled *user-facing downloadable proof-of-concept* is a self-contained HTML document with an embedded test MP3 and all three questions; source engine specifications and test fixtures never contain user voice data. Synthesized voice quality is a placeholder, not an evaluation baseline for accent or natural pronunciation.

## QA acceptance

- [ ] iOS/Android ChatGPT: tested file or player actually yields audible output, not just `audio controls` rendering.
- [ ] Real MP3 has successful decode/play, repeat works, 0.8× audio changes speed, controls have keyboard-accessible alternatives.
- [ ] Before actual audible playback, there is no scored listening success and normal listening questions remain gated.
- [ ] Without audio or on player error, mark `not_assessed` and offer a **genuine** fallback; no fabricated completion.
- [ ] Objective correct/wrong/distractor feedback matches trusted audio transcript and questions. Record first attempt/replay/hints separately.
- [ ] Free answer or unrecognized reasonable synonyms get teacher review, not incorrect-by-string-compare.
- [ ] Revealing transcript before response changes modality to text-supported; reveal after submission does not corrupt previous status.
- [ ] Required questions blank → incomplete; early exit explicit. No phantom 3/3.
- [ ] Submit sends one true ChatGPT turn; learner state saved only after explicit consent and verified connector write/readback.


## Mobile playback failure: field QA 2026-10-16

Observed in an ASIT mobile ChatGPT demo: the minimal inline media adapter *rendered*, but no sound played. Learner did not answer any of three questions and selected failure; listening is `not_assessed`. **No learner profile, answers or precise device identifiers are committed.** Original demonstrated source was a Wikimedia Commons `audio/ogg` Vorbis recording, not MP3. The Commons source exists, but codec availability, media network policy and in-chat embed support were not verified on the device, so the exact cause is unknown.

Open public issue: an Apps SDK iOS widget was reported to render normally yet produce no audio (https://github.com/openai/openai-apps-sdk-examples/issues/214). That is an analogous **unresolved report, not proof** that this ASIT client has the same issue.

**Mandatory safety change:** when mobile inline media is unverified or fails, do **not** suggest retrying visually identical inert audio controls or call it working. Mark listening `not_assessed`, keep native Intelligent UI questions in the chat, and offer a genuine validated MP3/AAC attachment or file link. Confirm the learner actually heard the clip **before** enabling listening answers. The link-opening event alone is not evidence. When the learner reports external playback, label evaluation `self_reported_external_audio_comprehension` (not host-verified). If no actual audio plays, stop and don't grade listening guesses.

Prioritize portable MP3/AAC for mobile delivery. OGG is an optional tested fallback only when **codec support for this client and asset is confirmed**. A valid OGG source URL is insufficient. Native webview client controls, OS/browser differences, audio media policy, network permissions and audio format remain separate hypotheses until reproduced. Do not claim swapping OGG to MP3 alone fixes in-app playback.

**Short-term accepted UX:** visible source link/MP3 attachment plus 2–3 native `radio-group` / `input` tasks and final `Submit` in the *same chat*; optional host-verified inline audio later. No standalone HTML page and no decorative player. Long-term: require a first-party audio primitive or verified sanctioned host audio bridge to deliver seamless playback; source repository rules cannot grant new client capabilities.
