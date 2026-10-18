# ASIT interactive micro-games — stateful host-safe pattern library

This reference is for **rendering real native UI**, not declaring imaginary games. Load for a game-style lesson, visual matching, picture-word input, stateful discovery, or movement request. Each game has an observable can-do, a meaningful decision, a visibly updated scene/selection, after-action feedback, and a distinct transfer item. A changed photograph alone is not a different cognitive operation.

## Mandatory micro-game for ordinary full lesson

For ANY full ASIT lesson, read the [complete interactive template](complete-native-lesson.md) and [rich-default contract](../../asit-lessons/references/rich-default-lesson.md) even if the learner did not ask for a game. A no-photo result is not a reason to omit this feature: a *working stateful SVG diagram* is a truthful and accessible visual-symbol fallback. The partial Parcel Mission scaffold below is **not a sufficient standalone five-task lesson**; the complete template provides Cards/All and the one canonical ASIT Submit. No static HTML prototype is implicitly run in ChatGPT.

## Three actual game patterns

### 1. Parcel Mission — predict → change → observe → explain → transfer

**Can-do:** describe where an object is using `in / on / under`. Present a clean spatial scene as an **interactive SVG diagram**, explicitly labelled `visual_symbolic` (never an original photograph or photographic image task).

- *Predict:* user selects one of three plausible landing locations **before** moving the parcel; show no correctness yet.
- *Manipulate:* a working `Move parcel` button changes `stage` state and actual parcel coordinates within the SVG.
- *Observe:* user sees the parcel in the new position. The selected answer receives a provisional Correct / Incorrect only **after the state change and a prediction**, and can be revised without revealing another task's answer.
- *Explain:* ask which relationship changed, using a different operation (e.g. chunk order, short form choice, or one original reason).
- *Transfer:* a fresh object, recipient and location require a new short message that cannot be copied from the visual prediction.
- *Movement quality:* SVG element position change is stateful **but not animation**. If the host supports a genuinely tested CSS transition in an embedded visual component, label it motion; otherwise render the instant-state SVG, never announce animation. Do not create inert Play, fake drag, or a fake image hotspot.

**Minimal native DIL rendering scaffold** (insert into a lesson card; add full lesson IDs, rubric and one existing final Submit outside the card):

```jsx
{@body const [stage,setStage] = DIL.useState(0)}
{@body const [prediction,setPrediction] = DIL.useState("")}
<box gap={3}>
  <text>Predict: where will the parcel be after the move?</text>
  <radio-group value={prediction} direction="col" onChange={setPrediction}>
    <radio value="under">Under the shelf</radio>
    <radio value="in">In the box</radio>
    <radio value="on">On the shelf</radio>
  </radio-group>
  <svg viewBox="0 0 360 200" width="100%" height="200px">
    <rect x="25" y="80" width="145" height="14" fill="#9b815b" />
    <rect x="215" y="117" width="95" height="67" fill="none" stroke="currentColor" strokeWidth="3"/>
    <rect x={stage===0?78:242} y={stage===0?51:137}
          width="30" height="26" rx="2" fill="#c67a36"/>
  </svg>
  <button disabled={!prediction||stage===1} onClick={()=>setStage(1)}>Move parcel</button>
  <button color="secondary" variant="outline" onClick={()=>{setStage(0);setPrediction("")}}>Replay</button>
  {#if stage===1 && prediction}
    <text color={prediction==="in"?"success":"danger"}>
      {prediction==="in"?"Correct":"Incorrect — Try again"}
    </text>
  {/if}
</box>
```

**Important:** The diagram is a useful visual *symbol*. Register a `visual_symbolic_spatial_prediction` operation rather than `image_choice`. When the learner says "I did not see the picture", do not infer an observed visual task. The SVG native element names above are host-dependent and need a desktop/mobile render check.

### 2. Image Detective — picture → noun retrieval → repair

For an actual **picture-word exercise**, first obtain a real, suitable image result in the same lesson-production turn. Associate exact source result ref, distinct visual operation and non-spoiling alt with a trusted rubric. Display the image immediately above a native `input` field; do **not** show a translation/key before the answer. Use semantic variants, including plurals and common synonyms, for teacher assessment after final Submit. If the image cannot be verified, replace the task with explicitly text-based retrieval **before preregistration**. A static picture is not an actionable hotspot.

### 3. Delivery Routes — matching with consequences

Present three separate grounded location cards and three independent service messages. A native `select` or `segmented-control` assigns each message to a card, with current assignments visible; user can reverse and retry. At the decisive choice, actually change a state variable (e.g. `deliveryStatus` to `delivered` or `needs_retry`), revealing consequences rather than only a badge. Reveal correctness for deterministic assignments *after* input; an independent final message must use a different service situation and cannot be copied from any card. If actual photographs are unavailable, use **labelled scene diagrams**; the matching task remains text/diagram supported, not photo-comprehension evidence.

## Rules for all games

1. Two cognitively different interactions, not merely two radio questions with new icons. Prefer discovery → repair, picture naming → contextual decision, or matching → micro-transfer.
2. `DIL.useState` state drives visible UI; controlled forms retain previous answers when switching Cards/All. Every button performs its label's action. `Undo` and `Replay` are real.
3. Story goals must affect state/outcome. Decorative scores, progress bars, confetti and animated GIFs are not learning evidence.
4. **Motion policy:** a slide/transition can be added only if a real supported host component actually renders it; offer reduced-motion/instant alternative. An SVG position snap is an observable state change, not motion graphics. If real animated playback cannot be confirmed, state exactly what is available.
5. **Interaction integrity:** a non-assessed practice animation cannot silently grade the learner. Separate guided prediction, recognition, comprehension and an optional 3–8-word self-generated transfer.
6. Accessibility: use labelled native selectors/buttons and textual destination equivalents; never demand pointer-only clicks on an image. Test on actual desktop/mobile host for focus, contrast, and tapped target sizes.
7. **Real images must be source-checked independently** per [media provenance](../../asit-lessons/references/media-provenance.md). Never invent `turn...image...` ids to fill a template. The SVG example needs no external photo.
8. Include exactly **one canonical final ASIT Submit** for a complete lesson; local game feedback is provisional and never a Sheets write.

## Optional runnable developer prototype

The repository contains a **standalone browser HTML prototype** at `plugin/prototypes/parcel-mission.html`. Unlike the native DIL scaffold above, it has a responsive SVG viewBox with a real CSS transition and `prefers-reduced-motion` support, Move/Replay actions and aria-live feedback. It is deliberately **not** bundled or executed by this Skills-only plugin, and it cannot perform trusted ASIT grading or persistent saving. Treat it as QA/reference implementation until a supported host renderer is actually tested.

## Release acceptance

In the client, complete: predict destination → move parcel → observe scene change → get local feedback → Replay → change prediction → finish the lesson; then switch Cards/All and verify answer retention. For Image Detective, remove the image tool result and ensure **the image-scored Activity is not registered**. For Delivery Routes, confirm reassignment and correct consequence. An unchecked snippet or CI string search is not a passing visual/game QA result.
