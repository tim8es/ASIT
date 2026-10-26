(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const previous = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const counter = document.querySelector("#counter");
  const chapter = document.querySelector("#chapter-now");
  const progress = document.querySelector("#progress");
  const fullscreenToggle = document.querySelector("#fullscreen-toggle");
  let current = 0;

  document.querySelectorAll(".provided-capture").forEach(image => {
    const show = () => {
      image.classList.add("ready");
      image.parentElement.querySelector(".capture-placeholder")?.remove();
    };
    image.addEventListener("load", show, { once: true });
    image.addEventListener("error", () => image.remove(), { once: true });
    if (image.complete && image.naturalWidth) show();
  });

  if (slides.length !== 14 || slides.some(slide => !slide.dataset.chapter)) {
    throw new Error("ASIT story deck needs 14 scenes with chapter labels.");
  }

  function render(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, position) => {
      const active = position === current;
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });
    counter.innerHTML = String(current + 1).padStart(2, "0") + " <i>/</i> " + String(slides.length).padStart(2, "0");
    chapter.textContent = slides[current].dataset.chapter;
    progress.value = String(current + 1);
    progress.setAttribute("aria-valuetext", "Сцена " + (current + 1) + " из " + slides.length);
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (updateHash && location.hash !== "#scene-" + (current + 1)) {
      history.replaceState(null, "", "#scene-" + (current + 1));
    }
  }

  previous.addEventListener("click", () => render(current - 1));
  next.addEventListener("click", () => render(current + 1));
  progress.addEventListener("input", () => render(Number(progress.value) - 1));
  fullscreenToggle.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {}
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreenToggle.setAttribute("aria-pressed", String(Boolean(document.fullscreenElement)));
  });
  window.addEventListener("hashchange", () => {
    const match = location.hash.match(/^#scene-(\d+)$/);
    if (match) render(Number(match[1]) - 1);
  });
  document.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.matches("input, textarea, select, audio, video, button, a") || target.isContentEditable)) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); render(current + 1); }
    else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); render(current - 1); }
    else if (event.key === "Home") { event.preventDefault(); render(0); }
    else if (event.key === "End") { event.preventDefault(); render(slides.length - 1); }
    else if (event.key.toLowerCase() === "f") fullscreenToggle.click();
  });

  progress.max = String(slides.length);
  const initial = location.hash.match(/^#scene-(\d+)$/);
  render(initial ? Number(initial[1]) - 1 : 0, !initial);
})();
