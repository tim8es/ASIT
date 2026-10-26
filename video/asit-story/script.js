(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const previous = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const counter = document.querySelector("#counter");
  const chapter = document.querySelector("#chapter-now");
  const timecode = document.querySelector("#timecode");
  const progress = document.querySelector("#progress");
  const fullscreenToggle = document.querySelector("#fullscreen-toggle");
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

  function move(amount) { render(current + amount); }

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  progress.addEventListener("input", () => render(Number(progress.value) - 1));
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
    else if (event.key === "Home") { event.preventDefault(); render(0); }
    else if (event.key === "End") { event.preventDefault(); render(slides.length - 1); }
    else if (event.key.toLowerCase() === "f") fullscreenToggle.click();
  });

  progress.max = String(slides.length);
  const initial = location.hash.match(/^#scene-(\d+)$/);
  render(initial ? Number(initial[1]) - 1 : 0, !initial);
})();
