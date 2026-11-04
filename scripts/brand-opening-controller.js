// Shared by the document and standalone review. Opening playback is independent
// of React readiness/API requests: 900ms presentation + 100ms exit, once per load.
(() => {
  let cancelCurrent;
  window.startAvanceOpening = (options = {}) => {
    cancelCurrent?.();
    const intro = document.getElementById("brand-intro");
    if (!intro) return Promise.resolve("unavailable");
    return new Promise((resolve) => {
      // Slow playback exists only on the standalone review, never the website.
      const speed = document.body.dataset.openingReview === "true" && options.slow === true ? .5 : 1;
      intro.style.transitionDuration = `${100 / speed}ms`;
      const root = document.getElementById("root");
      const wasInert = root?.hasAttribute("inert");
      const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
      const timers = [];
      const startedAt = performance.now();
      const logos = [...intro.querySelectorAll("img")];
      let frameRequest;
      let scene;
      let finished = false;
      const finish = (reason) => {
        if (finished) return;
        finished = true;
        cancelCurrent = undefined;
        timers.forEach(clearTimeout);
        cancelAnimationFrame(frameRequest);
        scene?.dispose();
        if (!wasInert) root?.removeAttribute("inert");
        intro.remove();
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("visibilitychange", onVisibility);
        motion?.removeEventListener?.("change", onMotion);
        intro.removeEventListener("pointerdown", onPointer);
        logos.forEach(logo => logo.removeEventListener("error", onError));
        resolve(reason);
      };
      const onKey = (event) => { if (event.key === "Escape" || event.key === "Tab") finish("skipped"); };
      const onPointer = (event) => { event.preventDefault(); finish("skipped"); };
      const onVisibility = () => { if (document.hidden) finish("hidden"); };
      const onMotion = () => { if (motion.matches) finish("reduced-motion"); };
      const onError = () => finish("image-error");
      cancelCurrent = () => finish("replayed");
      // Register the hard cleanup before making the underlying app inert.
      timers.push(setTimeout(() => finish("deadline"), 1000 / speed));
      intro.getAnimations({ subtree: true }).forEach(animation => { animation.playbackRate = speed; });
      if (motion?.matches) { finish("reduced-motion"); return; }
      if (document.hidden) { finish("hidden"); return; }
      try {
        root?.setAttribute("inert", "");
        document.addEventListener("keydown", onKey);
        document.addEventListener("visibilitychange", onVisibility);
        motion?.addEventListener?.("change", onMotion);
        intro.addEventListener("pointerdown", onPointer);
        logos.forEach(logo => logo.addEventListener("error", onError, { once: true }));
        const imageBudget = setTimeout(() => finish("image-timeout"), 225);
        timers.push(imageBudget);
        const decoded = logos.map(logo => {
          if (typeof logo.decode === "function") return logo.decode();
          if (logo.complete) return logo.naturalWidth ? Promise.resolve() : Promise.reject();
          return new Promise((ok, fail) => { logo.addEventListener("load", ok, { once: true }); logo.addEventListener("error", fail, { once: true }); });
        });
        Promise.all(decoded).then(() => {
          if (finished) return;
          clearTimeout(imageBudget);
          try { scene = window.createAvanceOpeningScene?.(intro); } catch { /* Logo-only fallback. */ }
          intro.classList.add("brand-intro--playing");
          intro.getAnimations({ subtree: true }).forEach(animation => {
            animation.playbackRate = speed;
            // Catch up to the shared clock after decode; do not extend the intro.
            if (animation.effect?.target !== intro) animation.currentTime = (performance.now() - startedAt) * speed;
          });
          const frame = now => {
            if (finished) return;
            // Atlas/particles retain their authored two-second time coordinates.
            try { scene?.draw((now - startedAt) * 2 * speed); } catch { scene?.dispose(); scene = null; }
            frameRequest = requestAnimationFrame(frame);
          };
          frameRequest = requestAnimationFrame(frame);
          timers.push(setTimeout(() => intro.classList.add("brand-intro--ready"), Math.max(0, 900 / speed - (performance.now() - startedAt))));
          timers.push(setTimeout(() => finish("complete"), Math.max(0, 1000 / speed - (performance.now() - startedAt))));
        }, onError);
      } catch { finish("unavailable"); }
    });
  };
  window.startAvanceOpening();
})();
