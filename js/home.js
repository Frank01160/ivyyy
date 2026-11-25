/* ==========================================================================
   HOME.JS — page-1-only interactions
   ========================================================================== */

/* ---------- Build the chat messages (with staggered reveal) ---------- */
const CHAT_MESSAGES = [
  { from: "sent",     name: "Frank", text: "Hi" },
  { from: "received", name: "Ivy",   text: "Hi" },
  { from: "sent",     name: "Frank", text: "Apparently you and I have been paired here in the campus..." },
  { from: "received", name: "Ivy",   text: "like aje 😂" },
  { from: "sent",     name: "Frank", text: "I'm Frank and was hoping to make a frnd" },
  { from: "received", name: "Ivy",   text: "naitwa Ivy" },
  { from: "sent",     name: "Frank", text: "First frnd to have called Ivy, it's a unique name." },
  { from: "received", name: "Ivy",   text: "pia ww, your name is unique 😌" },
  { from: "sent",     name: "Frank", text: "😜, not as much as urs. Even the pope was called Francis" },
  { from: "received", name: "Ivy",   text: "yangu sasa ni worst 😂" },
  { from: "sent",     name: "Frank", text: "Oh yeah... btw there's this character called poison ivy 😏" },
  { from: "received", name: "Ivy",   text: "haya 😂😂😂" },
  { from: "sent",     name: "Frank", text: "I'm doing civil engineering, lemmi try to guess yours." },
  { from: "received", name: "Ivy",   text: "okay guess 😌" }
];

(function buildChat() {
  const win = document.getElementById("chat-window");
  if (!win) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    CHAT_MESSAGES.forEach((m, i) => {
      const msg = document.createElement("div");
      msg.className = `chat-message ${m.from}`;
      msg.innerHTML = `<div class="chat-name">${m.name}</div><div class="chat-bubble">${escapeHTML(m.text)}</div>`;
      msg.style.opacity = 1;
      msg.style.transform = "none";
      win.appendChild(msg);
    });
    return;
  }

  // Lazy reveal — each message appears when its section is on screen
  let revealed = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !revealed) {
        revealed = true;
        CHAT_MESSAGES.forEach((m, i) => {
          setTimeout(() => {
            const msg = document.createElement("div");
            msg.className = `chat-message ${m.from}`;
            msg.innerHTML = `<div class="chat-name">${m.name}</div><div class="chat-bubble">${escapeHTML(m.text)}</div>`;
            msg.style.animationDelay = "0ms";
            win.appendChild(msg);
          }, i * 420);
        });
        io.disconnect();
      }
    });
  }, { threshold: 0.2 });

  io.observe(win);
})();

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Secret reveal ---------- */
(function initSecret() {
  const btn = document.getElementById("secret-open");
  const msg = document.getElementById("secret-message");
  if (!btn || !msg) return;

  btn.addEventListener("click", () => {
    msg.classList.add("is-open");
    btn.textContent = "Opened ♥";
    btn.disabled = true;
    setTimeout(() => {
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  });
})();

/* ---------- Thing-card secret ---------- */
(function initThingSecret() {
  const btn = document.querySelector('[data-secret="thing"]');
  const modal = document.getElementById("memory-modal");
  const body  = document.getElementById("memory-modal-body");
  if (!btn || !modal || !body) return;

  btn.addEventListener("click", () => {
    body.innerHTML = `
      <span class="chapter-number">THE SECRET FIFTH THING</span>
      <h3 style="font-family:var(--font-script);font-size:2.4rem;color:var(--rose);margin:12px 0;text-shadow:0 0 20px rgba(255,155,179,.5);">You.</h3>
      <p style="font-family:var(--font-serif);font-style:italic;color:var(--rose-soft);line-height:1.8;">
        Not just one thing about you — the whole package. The smile, the eyes,
        the attitude, that face. Everything, Ivy. That's the secret.
      </p>
      <p style="text-align:right;font-family:var(--font-script);color:var(--gold);font-size:1.4rem;margin-top:16px;">— Frank ♥</p>
    `;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  });
})();

/* ---------- Replay ---------- */
(function initReplay() {
  const btn = document.getElementById("replay-story");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelectorAll(".reveal").forEach(el => {
      el.classList.remove("is-visible");
      setTimeout(() => el.classList.add("is-visible"), 30);
    });
  });
})();

/* ---------- Enter-world scroll ---------- */
(function initEnterWorld() {
  const btn = document.getElementById("enter-world");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const target = document.getElementById("story");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();

/* ---------- Modal close (shared) ---------- */
(function initModalClose() {
  const modal = document.getElementById("memory-modal");
  if (!modal) return;
  const close = modal.querySelector(".modal-close");
  if (close) {
    close.addEventListener("click", () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    });
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
  });
})();
