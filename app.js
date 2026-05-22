// Nomik landing — tiny, dependency-free.

// Current year in the footer.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Shared set of real logos used by the decorative backdrops + accents.
const LOGO_SET = ["stripe","github","notion","shopify","hubspot","zendesk","intercom","linear","jira",
  "figma","dropbox","adyen","paypal","klarna","wise","asana","trello","confluence","gitlab",
  "sentry","datadog","cloudflare","mailchimp","snowflake","claude","googlegemini","gmail",
  "woocommerce","webflow","mongodb","vercel","airtable","calendly","posthog","elevenlabs"];

// Faded logo backdrop — drift behind CTAs + any .has-bg section (skips ones already set).
(function bgLogos() {
  document.querySelectorAll(".cta, .has-bg").forEach((el) => {
    el.classList.add("has-bg");
    if (el.querySelector(".bg-logos")) return;
    const pick = [...LOGO_SET].sort(() => Math.random() - 0.5).slice(0, 24);
    const div = document.createElement("div");
    div.className = "bg-logos";
    div.setAttribute("aria-hidden", "true");
    div.innerHTML = pick.map((s) => `<img src="logos/${s}.svg" alt="">`).join("");
    el.insertAdjacentElement("afterbegin", div);
  });
})();

// Foreground corner "sparkle" logos — in hero areas (and any .has-accents section).
(function accents() {
  // AI, voice & agent brands — the most recognizable, used (in order) on hero areas.
  const HERO_SET = ["claude", "googlegemini", "mistralai", "meta", "x", "deepseek",
    "perplexity", "huggingface", "elevenlabs", "deepgram", "livekit", "langchain",
    "ollama", "nvidia"];
  // Peripheral placements that stay clear of the centered headline.
  const POS = [
    { top: "8%", left: "5%", s: 48, r: -8 },
    { top: "11%", left: "29%", s: 32, r: 6 },
    { top: "9%", right: "27%", s: 30, r: -5 },
    { top: "14%", right: "6%", s: 42, r: 9 },
    { top: "22%", left: "15%", s: 28, r: 7 },
    { top: "27%", right: "14%", s: 28, r: -7 },
    { top: "45%", left: "2.5%", s: 34, r: 5 },
    { top: "50%", right: "2.5%", s: 36, r: -6 },
    { bottom: "16%", left: "7%", s: 44, r: 7 },
    { bottom: "12%", left: "31%", s: 30, r: -6 },
    { bottom: "24%", right: "13%", s: 28, r: 6 },
    { bottom: "10%", right: "5%", s: 50, r: -7 },
  ];
  document.querySelectorAll(".hero, .page-hero, .has-accents").forEach((el) => {
    if (el.querySelector(".fg-logo")) return;
    const isHero = el.matches(".hero, .page-hero");
    const pool = isHero ? HERO_SET : [...LOGO_SET].sort(() => Math.random() - 0.5);
    POS.forEach((p, i) => {
      const d = document.createElement("div");
      d.className = "fg-logo";
      d.setAttribute("aria-hidden", "true");
      const pos = ["top", "bottom", "left", "right"].map((k) => (p[k] ? `${k}:${p[k]};` : "")).join("");
      d.style.cssText = `width:${p.s}px;height:${p.s}px;${pos}--r:${p.r}deg;transform:rotate(${p.r}deg);` +
        `animation:fg-float ${6 + i * 0.6}s ease-in-out ${(i * 0.5).toFixed(1)}s infinite;`;
      d.innerHTML = `<img src="logos/${pool[i % pool.length]}.svg" alt="" width="${Math.round(p.s * 0.5)}" height="${Math.round(p.s * 0.5)}">`;
      el.appendChild(d);
    });
  });
})();

// Mobile nav — inject a hamburger toggle (so every page gets it without markup changes).
(function initMobileNav() {
  const nav = document.querySelector(".nav");
  const cta = nav && nav.querySelector(".nav-cta");
  const links = nav && nav.querySelector(".nav-links");
  if (!nav || !cta || !links) return;
  const btn = document.createElement("button");
  btn.className = "nav-toggle";
  btn.type = "button";
  btn.setAttribute("aria-label", "Open menu");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  cta.insertBefore(btn, cta.firstChild);
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && !nav.contains(e.target)) setOpen(false);
  });
})();

// Reveal sections on scroll (respects prefers-reduced-motion via CSS).
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Tab-driven carousels (hero demo, use-cases) — auto-rotating, pause on hover/focus.
document.querySelectorAll("[data-carousel]").forEach(initCarousel);

function initCarousel(root) {
  const slides = [...root.querySelectorAll(".slide")];
  const tabs = [...root.querySelectorAll(".ctab")];
  if (!slides.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const auto = root.dataset.carousel !== "manual";
  let i = 0;
  let timer = null;

  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.classList.toggle("is-active", k === i);
      s.setAttribute("aria-hidden", String(k !== i));
    });
    tabs.forEach((t, k) => {
      t.classList.toggle("is-active", k === i);
      t.setAttribute("aria-selected", String(k === i));
    });
  }
  function start() {
    if (reduce || !auto) return;
    stop();
    timer = setInterval(() => show(i + 1), 5000);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  tabs.forEach((t, k) =>
    t.addEventListener("click", () => {
      show(k);
      start();
    })
  );
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  show(0);
  start();
}

// Waitlist form.
//
// No backend yet (the app is dev-phase). This validates + confirms client-side.
// To capture for real, set WAITLIST_ENDPOINT to a POST URL that accepts { email }
// (e.g. Formspree, or the auth-service once a /v1/waitlist route exists).
const WAITLIST_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxx"

const form = document.getElementById("waitlist-form");
const msg = document.getElementById("form-msg");

if (form && msg) form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const email = new FormData(form).get("email")?.toString().trim() ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = "Please enter a valid email.";
    msg.className = "form-msg err";
    return;
  }

  const btn = form.querySelector("button");
  btn.disabled = true;

  try {
    if (WAITLIST_ENDPOINT) {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } else {
      console.info("[waitlist] captured (no endpoint wired):", email);
    }
    form.classList.add("is-done");
    msg.textContent = "You're on the list. We'll be in touch soon.";
    msg.className = "form-msg ok";
  } catch {
    btn.disabled = false;
    msg.textContent = "Something went wrong — try again in a moment.";
    msg.className = "form-msg err";
  }
});
