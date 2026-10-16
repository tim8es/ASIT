# ELLLO — ASIT's first external listening/video source

**Source selection:** ELLLO (https://elllo.org) is the *sole preferred external media discovery source* for the initial ASIT audio/video pilot, selected after mobile UX QA. It is NOT a connected media service, licensed asset bucket, site crawler, ready-to-use audio database or native ChatGPT video player. Do not silently substitute other sources while reporting the ELLLO pilot's coverage.

## Why this source

ELLLO states it has over 3,000 free English listening lessons; One Minute English accounts for over 1,000 video lessons. The site organizes content by A1–C1 and features authentic speakers from 100+ countries, real spoken English, transcripts/scripts, vocabulary and quizzes on many pages. Distinct collections:
- **One Minute English (phase 1):** original-site video clips, short conversational responses by international speakers. Start here for audio comprehension plus video evidence.
- **Sound Grammar (phase 2):** short video/animations targeting grammar forms.
- **Views / Natural English (phase 3):** richer but often longer conversations; not automatically eligible for 35s audio cards.

Sources read on 2026-10-16:
- Index https://www.elllo.org/video/
- Level catalog https://www.elllo.org/levels/index.htm
- Educational guide https://www.elllo.org/guide/guide-english/english-guide-2-one-minute-english.htm
- Owner's FAQ and use permissions https://www.elllo.org/about/faq.htm

**Important conflict:** One Minute English promotional pages say clips are under 60 seconds, but indexed pages include listed lengths over a minute (e.g. 1:15, 1:39). Trust an individually checked actual **media** duration over a brand name or summary. ASIT normal one-card audio cap stays **5–35s** (target 15–35s). 36–90s only for explicitly requested extended video listening; no silent exception just because the source is called One Minute English.

## Rights and linking policy

The ELLLO creator permits teachers to download available audio for classroom/LMS use, but states video files are not available through this permission and has a separate fee mechanism for broader file requests. This is **not a blanket commercial redistribution or video rehosting license**. For the initial ASIT pilot:
- Link learners to **exact original ELLLO lesson pages** for watching/listening; no direct ripping, rehosting, video downloads, or invented "embed allowed" assumption.
- Store minimal bibliographic metadata only: title, official source URL, topic tags, ELLLO's lesson level, speaker country and review status. No full transcript copied into GitHub; do not duplicate ELLLO's quizzes as-is.
- Create short **original** ASIT comprehension checks based on actually reviewed source content, with brief attribution and no unrevealed text inserted as an answer key.
- Seek explicit ELLLO permission before caching/serving videos, bulk extraction, republishing full scripts, or incorporating assets into a commercial or public service. An original-site link is **not** automatically an embedded video.

## Pilot index — five verified lesson pages, none yet media-QA-approved

See `src/elllo-source.mjs` for five live source pages and a pure local topic/level finder:
- A2 **Weekend / Past Simple** — Jill (Australia), `elllo-a2-weekend-jill`
- A2 **Train or bus / travel** — Lesya (Ukraine), `elllo-a2-public-transport-lesya`
- A2 **Daily routine / working from home** — Nerissa (Philippines), `elllo-a2-daily-routine-nerissa`
- A2 **Parks / can, abilities** — Todd (USA), `elllo-a2-park-todd`
- B1 **Dream job / remote work** — Lucia (Namibia), `elllo-b1-dream-job-lucia`

These are **candidate lesson URLs** verified for visible scripts and original-site video player links. Their *media duration, playback on learner mobile and suitability under the 35s cap have NOT been checked*. Their state is `source_lesson_verified_media_unassessed`. Do not label the five as five immediately playable ASIT cards. Other ELLLO lesson pages may have audio fallbacks but cannot be claimed playable in ChatGPT until tested.

## ASIT learning/UX workflow

1. For requested topic and available learner level **if known**, query the curated local index; otherwise present choices without inferring learner CEFR. If no catalog match, search **ELLLO only** (or transparently state no verified ELLLO match). Do not pretend the initial index covers the entire ELLLO library.
2. Fetch and validate the actual ELLLO lesson page, title, speaker and subject. Verify direct original page link. Review actual talk or a legally accessible authorized transcript enough to ground answer questions; do not hallucinate spoken details.
3. Verify real media duration and mobile playback. Standard audio card must be ≤35 s and at least 5 s; any longer ELLLO video requires explicit opt-in for the <=90s extended video variant. Don't ask user to manually scrub a 2-minute video and call it a short clip.
4. Render an **Intelligent UI** in-chat native question card with original ELLLO video link (user opens authorized original video separately). Audio/video playback in host remains unverified; text stays hidden until submitted unless user opts into assisted listening.
5. Ask if audio genuinely played and whether transcript was read; classify self-reported external video comprehension vs text-supported or not_assessed. Correct answers via rubric grounded in that exact recording, not website summary alone.
6. Cache **only the reviewed source lesson metadata, duration/source-check receipt, original authored question IDs and rights flag** if the source terms permit; no personal learner data in GitHub. Learner scores require separate private-state consent and verified connector write+readback.

## Next acceptance gates

- A source page can be opened by the user on mobile and plays genuine video **with sound**.
- The full clip is actually within the chosen time window, or user explicitly opts into extended listening.
- Two original objective comprehension items are actually grounded in what the speaker says.
- Normal native question controls, answer completeness, mobile Submit and post-attempt feedback work.
- No copying/rehosting ELLLO video or transcript; no learner data is written without consent.
- User-approved audiovisual media is kept distinct from standalone audio and text-only reading.

**Status (2026-10-16): source selected, metadata-only seed index and reference tests added. Not yet an authorized bulk-crawler, not a permission grant, not verified mobile-video playback and not a finished ready-to-teach media cache.**


## Automatic discovery and activity builder (v1)

The metadata-only seed has **six** entries as of this version: the original five One Minute English pages and A2 Sound Grammar **Present Continuous** (four scoped conversations). This is not six audio-ready clips. The new [ELLLO automatic workflow](ELLLO-AUTO-LESSONS.md) specifies the complete real-time chat sequence and `src/elllo-activity-pipeline.mjs` now has automatic query planning, topic/source filtering, scoping and native question preparation. The teacher actually invokes web search/read in each relevant session; the Node module itself is offline. Live search can discover beyond six seed URLs, but a search match is not a playback or transcript QA pass. Respect duration, author rights, learner consent and original-site source links.
