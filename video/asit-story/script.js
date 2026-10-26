(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const previous = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const counter = document.querySelector("#counter");
  const chapter = document.querySelector("#chapter-now");
  const timecode = document.querySelector("#timecode");
  const progress = document.querySelector("#progress");
  const fullscreenToggle = document.querySelector("#fullscreen-toggle");
  const narrationPlay = document.querySelector("#narration-play");
  const narrationStop = document.querySelector("#narration-stop");
  const narrationStatus = document.querySelector("#narration-status");
  const speech = window.speechSynthesis;
  const narration = window.ASIT_NARRATION || [];
  let current = 0;
  let narrator = null;
  let narrationActive = false;
  let narrationRun = 0;

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

  function updateNarrationStatus() {
    narrator = speech?.getVoices().find(voice => /^ru(-|_)/i.test(voice.lang)) || null;
    const ready = Boolean(narrator && narration.length === slides.length && typeof window.SpeechSynthesisUtterance === "function");
    narrationPlay.disabled = !ready || narrationActive;
    narrationStop.disabled = !narrationActive;
    if (!narrationActive) narrationStatus.textContent = narrator ? "РУССКИЙ ГОЛОС: " + narrator.name : "РУССКИЙ ГОЛОС НЕ НАЙДЕН";
    narrationStatus.dataset.ready = String(ready);
  }

  function stopNarration(message = "ОЗВУЧКА ОСТАНОВЛЕНА") {
    narrationRun += 1;
    narrationActive = false;
    speech?.cancel();
    narrationStatus.textContent = message;
    updateNarrationStatus();
    if (message !== "ОЗВУЧКА ОСТАНОВЛЕНА") narrationStatus.textContent = message;
  }

  function speakScene(index, run) {
    if (!narrationActive || run !== narrationRun) return;
    if (index >= slides.length) {
      stopNarration("ПРОСЛУШИВАНИЕ ЗАВЕРШЕНО");
      return;
    }
    render(index);
    narrationStatus.textContent = "СЛАЙД " + (index + 1) + " ИЗ " + slides.length;
    const utterance = new SpeechSynthesisUtterance(narration[index]);
    utterance.lang = "ru-RU";
    utterance.voice = narrator;
    utterance.rate = 0.98;
    utterance.onend = () => {
      if (narrationActive && run === narrationRun) window.setTimeout(() => speakScene(index + 1, run), 350);
    };
    utterance.onerror = () => {
      if (run === narrationRun) stopNarration("БРАУЗЕР НЕ СМОГ ПРОИЗНЕСТИ ТЕКСТ");
    };
    speech.speak(utterance);
  }

  function move(amount) {
    if (narrationActive) stopNarration();
    render(current + amount);
  }

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  progress.addEventListener("input", () => {
    if (narrationActive) stopNarration();
    render(Number(progress.value) - 1);
  });
  narrationPlay.addEventListener("click", () => {
    if (!narrator || narration.length !== slides.length) return;
    narrationActive = true;
    const run = ++narrationRun;
    updateNarrationStatus();
    speakScene(current, run);
  });
  narrationStop.addEventListener("click", () => stopNarration());
  speech?.addEventListener("voiceschanged", updateNarrationStatus);
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
    if (match) render(Number(match[1]) - 1, false);
  });
  document.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable)) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); move(1); }
    else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); move(-1); }
    else if (event.key === "Home") { event.preventDefault(); if (narrationActive) stopNarration(); render(0); }
    else if (event.key === "End") { event.preventDefault(); if (narrationActive) stopNarration(); render(slides.length - 1); }
    else if (event.key.toLowerCase() === "f") fullscreenToggle.click();
  });

  progress.max = String(slides.length);
  updateNarrationStatus();
  const initial = location.hash.match(/^#scene-(\d+)$/);
  render(initial ? Number(initial[1]) - 1 : 0, !initial);
})();
