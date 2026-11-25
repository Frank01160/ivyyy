/* ==========================================================================
   APP.JS — shared behaviour for index.html + magic.html
   ========================================================================== */

/* ---------- Music toggle (persists across pages) ---------- */
(function initMusic() {
  const audio   = document.getElementById("our-song");
  const toggle  = document.getElementById("music-toggle");
  if (!audio || !toggle) return;

  const KEY = "ivy_frank_music_on";
  const shouldPlay = sessionStorage.getItem(KEY) === "1";

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
        // Browser may block autoplay — user must click again
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

  if (shouldPlay) {
    audio.play().then(() => setPressed(true)).catch(() => {});
  }
})();

/* ---------- Love petal field (velvet "bubbles" = heart emojis) ---------- */
(function initPetals() {
  const field = document.getElementById("love-petal-field");
  if (!field) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

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
    p.style.setProperty("--drift", ((Math.random() * 60 - 30).toFixed(1)) + "px");
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
    if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
      raf = requestAnimationFrame(tick);
    } else raf = null;
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

/* ---------- Thing-card mouse glow (desktop) ---------- */
(function initCardGlow() {
  document.querySelectorAll(".thing-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  });
})();

/* ---------- Smooth-scroll for in-page anchors (respects motion pref) ---------- */
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
