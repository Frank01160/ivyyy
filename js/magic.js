/* ==========================================================================
   MAGIC.JS — page-2 wish interactions
   ========================================================================== */

(function initWishStage() {
  const stage = document.getElementById("wish-stage");
  const counterEl = document.getElementById("wish-count");
  if (!stage || !counterEl) return;

  let count = 0;
  const WISH_EMOJI = ["🌟", "💫", "⭐", "✨", "💖", "❤️", "🕯️", "💝"];

  function spawnWish(x, y) {
    // Main rising emoji
    const w = document.createElement("span");
    w.className = "wish-lantern";
    w.textContent = WISH_EMOJI[Math.floor(Math.random() * WISH_EMOJI.length)];
    w.style.left = x + "px";
    w.style.top  = y + "px";
    w.style.setProperty("--wx", (Math.random() * 120 - 60).toFixed(1) + "px");
    w.style.setProperty("--wr", (Math.random() * 40 - 20).toFixed(1) + "deg");
    stage.appendChild(w);
    stage.classList.add("has-wishes");

    // 6 sparkles radiating
    for (let i = 0; i < 6; i++) {
      const s = document.createElement("span");
      s.className = "wish-spark";
      s.style.left = x + "px";
      s.style.top  = y + "px";
      const ang = (Math.PI * 2 * i) / 6 + Math.random() * 0.6;
      const dist = 30 + Math.random() * 40;
      s.style.setProperty("--sx", (Math.cos(ang) * dist).toFixed(1) + "px");
      s.style.setProperty("--sy", (Math.sin(ang) * dist).toFixed(1) + "px");
      stage.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }

    // Clean up the lantern after its animation
    setTimeout(() => w.remove(), 6200);

    // Update counter
    count++;
    counterEl.textContent = count;
    counterEl.classList.add("bump");
    setTimeout(() => counterEl.classList.remove("bump"), 300);
  }

  stage.addEventListener("click", (e) => {
    const r = stage.getBoundingClientRect();
    spawnWish(e.clientX - r.left, e.clientY - r.top);
  });

  stage.addEventListener("touchstart", (e) => {
    // Prevent double-fire; click already covers most mobile
    // but touchstart on iOS sometimes doesn't fire click on non-buttons
    const t = e.touches[0];
    if (!t) return;
    const r = stage.getBoundingClientRect();
    const x = t.clientX - r.left;
    const y = t.clientY - r.top;
    if (x >= 0 && y >= 0 && x <= r.width && y <= r.height) {
      spawnWish(x, y);
    }
  }, { passive: true });
})();
