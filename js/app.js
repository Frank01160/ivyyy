/* ==========================================================================
   APP.JS — Frank × Ivy shared behaviour
   Includes the 3D cube tilt for both desktop (mouse) and phones (tap/drag
   + device orientation). Auto-detects what's available and does the right
   thing. Anything not supported silently degrades.
   ========================================================================== */

/* ---------- 3D CUBE TILT ---------- */
(function initCubeTilt() {
  const cube = document.querySelector(".site-cube");
  if (!cube) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const MAX_TILT  = 6;    // degrees
  const MAX_SHIFT = 12;   // px
  const SMOOTH    = 0.12;

  let targetX = 0, targetY = 0, targetMx = 0, targetMy = 0;
  let curX = 0, curY = 0, curMx = 0, curMy = 0;
  let rafId = null;

  function tick() {
    curX  += (targetX  - curX)  * SMOOTH;
    curY  += (targetY  - curY)  * SMOOTH;
    curMx += (targetMx - curMx) * SMOOTH;
    curMy += (targetMy - curMy) * SMOOTH;

    cube.style.setProperty("--rx", curX.toFixed(3));
    cube.style.setProperty("--ry", curY.toFixed(3));
    cube.style.setProperty("--mx", curMx.toFixed(2));
    cube.style.setProperty("--my", curMy.toFixed(2));

    const settled =
      Math.abs(targetX  - curX)  < 0.01 &&
      Math.abs(targetY  - curY)  < 0.01 &&
      Math.abs(targetMx - curMx) < 0.05 &&
      Math.abs(targetMy - curMy) < 0.05;

    rafId = settled ? null : requestAnimationFrame(tick);
  }

  function kick() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Desktop: mouse move ---------- */
  if (canHover) {
    window.addEventListener("mousemove", (e) => {
      const nx = (e.clientX / window.innerWidth)  * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX  =  ny * MAX_TILT;
      targetY  = -nx * MAX_TILT;
      targetMx = -nx * MAX_SHIFT;
      targetMy = -ny * MAX_SHIFT;
      kick();
    });
    window.addEventListener("mouseleave", () => {
      targetX = targetY = targetMx = targetMy = 0;
      kick();
    });
  }

  /* ---------- Phone: tap + drag to tilt ---------- */
  let touchActive = false;
  let startX = 0, startY = 0;

  window.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    touchActive = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!touchActive || e.touches.length !== 1) return;
    const t = e.touches[0];
    // Accumulate drag distance into normalised -1…1
    const dx = (t.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
    const dy = (t.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    // Clamp and ease
    const nx = Math.max(-1, Math.min(1, dx));
    const ny = Math.max(-1, Math.min(1, dy));

    targetX  =  ny * MAX_TILT;
    targetY  = -nx * MAX_TILT;
    targetMx = -nx * MAX_SHIFT;
    targetMy = -ny * MAX_SHIFT;
    kick();
  }, { passive: true });

  window.addEventListener("touchend", () => {
    touchActive = false;
    // Settle gently back to neutral
    targetX = targetY = targetMx = targetMy = 0;
    kick();
  }, { passive: true });

  /* ---------- Phone: device orientation (if available + permitted) ---------- */
  function onOrientation(e) {
    if (touchActive) return;                 // drag takes priority
    if (e.beta == null || e.gamma == null) return;

    // beta: front-to-back tilt (-180…180), gamma: left-to-right (-90…90)
    const ny = Math.max(-1, Math.min(1, e.beta  / 45));  // ±45° full tilt
    const nx = Math.max(-1, Math.min(1, e.gamma / 45));

    targetX  =  ny * MAX_TILT;
    targetY  = -nx * MAX_TILT;
    targetMx = -nx * MAX_SHIFT;
    targetMy = -ny * MAX_SHIFT;
    kick();
  }

  // Only attach if it's a touch device AND permission is available
  if (!canHover && "DeviceOrientationEvent" in window) {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      // iOS 13+ requires user gesture — attach on first tap
      const askOnce = () => {
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", onOrientation);
            }
          })
          .catch(() => { /* user denied, ignore */ });
        window.removeEventListener("touchstart", askOnce);
      };
      window.addEventListener("touchstart", askOnce, { once: true });
    } else {
      window.addEventListener("deviceorientation", onOrientation);
    }
  }
})();

/* ---------- Music toggle ---------- */
(function initMusic() {
  const audio  = document.getElementById("our-song");
  const toggle = document.getElementById("music-toggle");
  if (!audio || !toggle) return;

  const KEY = "ivy_frank_music_on";

  function setPressed(on) {
    toggle.setAttribute("aria-pressed", on ? "true" : "false");
    toggle.setAttribute("aria-label", on ? "Pause our song" : "Play our song");
    const label = toggle.querySelector(".music-label");
    if (label) label.textContent = on ? "Playing" : "Our song";
  }

  toggle.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        sessionStorage.setItem(KEY, "1");
        setPressed(true);
      } catch (e) {
        console.warn("Audio blocked:", e);
      }
    } else {
      audio.pause();
      sessionStorage.setItem(KEY, "0");
      setPressed(false);
    }
  });

  audio.addEventListener("play",  () => setPressed(true));
  audio.addEventListener("pause", () => setPressed(false));

  if (sessionStorage.getItem(KEY) === "1") {
    audio.play().then(() => setPressed(true)).catch(() => {});
  }
})();

/* ---------- Love petals ---------- */
(function initPetals() {
  const field = document.getElementById("love-petal-field");
  if (!field) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const EMOJIS = ["❤️", "💕", "💖", "💗", "💘", "💝", "🌸", "✨", "💞"];
  const isPhone = window.matchMedia("(max-width: 640px)").matches;
  const COUNT = isPhone ? 14 : 26;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement("span");
    p.className = "love-petal";
    p.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const size = 12 + Math.random() * (isPhone ? 16 : 22);
    p.style.fontSize = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = (10 + Math.random() * 16).toFixed(2) + "s";
    p.style.animationDelay = (-Math.random() * 20).toFixed(2) + "s";
    p.style.setProperty("--drift", (Math.random() * 60 - 30).toFixed(1) + "px");
    p.style.opacity = (0.45 + Math.random() * 0.4).toFixed(2);
    frag.appendChild(p);
  }
  field.appendChild(frag);
})();

/* ---------- Cursor aura (desktop only) ---------- */
(function initCursorAura() {
  const aura = document.getElementById("cursor-aura");
  if (!aura) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  function tick() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    aura.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    raf = (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5)
      ? requestAnimationFrame(tick)
      : null;
  }

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (raf === null) raf = requestAnimationFrame(tick);
  });
})();

/* ---------- Scroll reveal ---------- */
(function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  els.forEach(el => io.observe(el));
})();

/* ---------- Thing-card glow (desktop) ---------- */
(function initCardGlow() {
  document.querySelectorAll(".thing-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width  * 100).toFixed(1) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top)  / r.height * 100).toFixed(1) + "%");
    });
  });
})();

/* ---------- Smooth in-page anchors ---------- */
(function initAnchors() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
