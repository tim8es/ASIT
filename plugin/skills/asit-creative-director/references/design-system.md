# ASIT Design System — Level 1 / v0.3.8

**Positioning:** premium playful editorial, adult-friendly: contemporary educational editorial design meets human, purposeful interactive storytelling. Distinctive, composed, readable, not a children's cartoon nor a corporate questionnaire. Prefer elegance and clarity over novelty for its own sake.

## Visual decisions (guide, not enforced device rendering)

- **Visual thesis first:** pick one consistent direction for the lesson: spatial illustrated discovery / annotated photography / friendly editorial conversation / schematic reasoning / document studio. One primary scene or document; secondary visuals must support it.
- **Palette inspiration (for compatible authored assets only):** Ink `#26364A`, Canvas `#F4F0E8`, Sage `#4B897E`, Coral `#F0A17B`, Honey `#DDBE68`. Native ChatGPT components may render their own theme; use semantic color roles and accessible contrast rather than pretend CSS overrides. No mandatory palette reproduction in native DIL.
- **Composition:** one clear hero/evidence region when relevant, concise objective, short instructions, readable text and whitespace; visible focus and position/progress cues. Use a restrained 1–2 accent hierarchy and consistent object/character treatments within a lesson.
- **Illustration:** a shared world and visual language across the lesson, with stable character traits and objects where visually possible. Prefer authored consistent imagery or verified authentic photos that truly support tasks. A random query-image montage, generic stock-looking cover or unrelated decorative diagram is a quality failure.
- **Responsive design:** phone-first reading order and controls; appropriate visual ratio (usually landscape scene for room/map; portrait for object-card); alt text must not leak answer. Do not assume the user's device rendered correctly without evidence.
- **Typography:** rely on host typographic system; hierarchy by meaning (title, task, evidence, action, feedback), not decorative fake font controls. Avoid nested headings and excessive badge/noise density.
- **Feedback:** finite selection -> correct/neutral try again as permitted by UI contract; qualitative writing -> meaningful teacher review after Submit. When the scene can evolve, user-driven state changes must reflect the actual decision, not an invented reward animation.
- **Motion:** only call movement/animation when a genuinely supported/rendered mechanism exists; native SVG coordinate changes are state switches. Offer static/reduced-motion equivalent. No simulated timer, video, audio, drag or clickable hotspots.

## Anti-patterns / release blockers

- Five boxes of text with different icons called a "game"; pretty but unscored cover; image question whose answer could be given without seeing the image; story without an outcome; same apartment/parcel/mug scene repeated; five multiple-choice questions; badges as decoration; irrelevant emoji; hints that leak correct answers; broken image asset; unverified sound; fake success or CEFR progress.
- Never sacrifice mastery evidence, consent, source verification or accessibility merely to meet a visual quota. Pure reading, live multi-turn dialogue and short focused drills can intentionally have zero illustrations.
