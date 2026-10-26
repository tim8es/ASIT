(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const previous = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const counter = document.querySelector("#counter");
  const chapter = document.querySelector("#chapter-now");
  const timecode = document.querySelector("#timecode");
  const progress = document.querySelector("#progress");
  const fullscreenToggle = document.querySelector("#fullscreen-toggle");
  const audio = document.querySelector("#narration-audio");
  const durationLabel = document.querySelector("#duration-label");
  const timings = window.ASIT_AUDIO_TIMINGS || [];
  let current = 0;

  if (slides.length < 30 || slides.length > 40 || slides.some(slide => !slide.dataset.time)) {
    throw new Error("ASIT Story Deck needs 30–40 scenes with timecodes.");
  }

  function render(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, position) => {
      const active = position === current;
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });
    const slide = slides[current];
    const number = String(current + 1).padStart(2, "0");
    counter.innerHTML = `${number} <i>/</i> ${String(slides.length).padStart(2, "0")}`;
    chapter.textContent = slide.dataset.chapter || "ASIT STORY";
    timecode.textContent = slide.dataset.time || "";
    progress.value = String(current + 1);
    progress.setAttribute("aria-valuetext", `Слайд ${current + 1} из ${slides.length}`);
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (updateHash && location.hash !== `#scene-${current + 1}`) {
      history.replaceState(null, "", `#scene-${current + 1}`);
    }
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "--:--";
    const value = Math.max(0, Math.floor(seconds || 0));
    return String(Math.floor(value / 60)).padStart(2, "0") + ":" + String(value % 60).padStart(2, "0");
  }

  function sceneAtTime(seconds) {
    let index = 0;
    for (let position = 1; position < timings.length; position += 1) {
      if (seconds < timings[position].start) break;
      index = position;
    }
    return index;
  }

  function updateAudioPosition() {
    if (timings.length !== slides.length || !Number.isFinite(audio.currentTime)) return;
    const index = sceneAtTime(audio.currentTime);
    if (index !== current) render(index);
    timecode.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
  }

  function moveTo(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    render(target);
    if (timings.length === slides.length) {
      audio.currentTime = timings[target].start;
      timecode.textContent = formatTime(timings[target].start) + " / " + formatTime(audio.duration);
    }
  }

  function move(amount) {
    moveTo(current + amount);
  }

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  progress.addEventListener("input", () => moveTo(Number(progress.value) - 1));
  audio.addEventListener("timeupdate", updateAudioPosition);
  audio.addEventListener("seeked", updateAudioPosition);
  audio.addEventListener("loadedmetadata", () => {
    durationLabel.textContent = "ОЗВУЧКА · " + formatTime(audio.duration);
    audio.currentTime = timings[current]?.start || 0;
    updateAudioPosition();
  });
  audio.addEventListener("ended", () => {
    render(slides.length - 1);
    timecode.textContent = formatTime(audio.duration) + " / " + formatTime(audio.duration);
  });
  fullscreenToggle.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { /* Browser policy can block fullscreen when it is not user initiated. */ }
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreenToggle.setAttribute("aria-pressed", String(Boolean(document.fullscreenElement)));
  });
  window.addEventListener("hashchange", () => {
    const match = location.hash.match(/^#scene-(\d+)$/);
    if (match) moveTo(Number(match[1]) - 1);
  });
  document.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.matches("input, textarea, select, audio, video, button") || target.isContentEditable)) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); move(1); }
    else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); move(-1); }
    else if (event.key === "Home") { event.preventDefault(); moveTo(0); }
    else if (event.key === "End") { event.preventDefault(); moveTo(slides.length - 1); }
    else if (event.key.toLowerCase() === "f") fullscreenToggle.click();
  });

  progress.max = String(slides.length);
  const initial = location.hash.match(/^#scene-(\d+)$/);
  const initialIndex = initial ? Number(initial[1]) - 1 : 0;
  render(initialIndex, !initial);
  if (timings.length === slides.length) moveTo(initialIndex);
})();
