// Nomik landing — tiny, dependency-free.

// Current year in the footer.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Any #waitlist anchor (nav + hero CTAs) scrolls AND focuses the email input,
// so the user can start typing the moment the form is in view.
document.querySelectorAll('a[href="#waitlist"], a[href$="#waitlist"]').forEach((a) => {
  a.addEventListener("click", (ev) => {
    const target = document.getElementById("waitlist");
    const input = document.querySelector('#waitlist-form input[type="email"]');
    if (!target || !input) return; // let default anchor behaviour handle it
    ev.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Wait for smooth-scroll to finish before focusing (otherwise iOS fights it).
    setTimeout(() => input.focus({ preventScroll: true }), 550);
  });
});

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
  // Hero pool: mainstream tools a startup actually uses — main AI/voice + popular SaaS.
  // Shuffled per page so each page's hero shows a different mix.
  const HERO_POOL = [
    "claude", "googlegemini", "mistralai", "meta", "perplexity", "huggingface",
    "elevenlabs", "deepgram", "livekit", "deepseek",
    "stripe", "github", "gitlab", "notion", "figma", "linear", "vercel", "gmail",
    "googledrive", "hubspot", "intercom", "zendesk", "shopify", "mailchimp", "brevo",
    "airtable", "asana", "trello", "dropbox", "sentry", "datadog", "cloudflare",
    "posthog", "calendly", "webflow", "aircall", "paypal", "confluence"];
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
    const pool = [...(isHero ? HERO_POOL : LOGO_SET)].sort(() => Math.random() - 0.5);
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
// Posts { email, turnstileToken } to a Supabase Edge Function. The function is
// the only writer to the waitlist table (service role); the browser holds no
// Supabase key. Cloudflare Turnstile gates submissions before any DB work.
//
// Operator: replace both constants with values from the deployed function +
// the Turnstile site key. Until both are wired, submissions log to console
// so we don't lose signal during a half-deployed state.
const WAITLIST_ENDPOINT = "https://qerdbjcmheeuwexmfyam.supabase.co/functions/v1/submit-waitlist";
const TURNSTILE_SITEKEY = "0x4AAAAAADVjnrrRgwexBYuo";

const endpointWired =
  !WAITLIST_ENDPOINT.includes("REPLACE_WITH_") && !TURNSTILE_SITEKEY.includes("REPLACE_WITH_");

// Turnstile loads with ?onload=onTurnstileReady; we just need the callback
// to exist so the script doesn't error. Rendering happens on submit, not boot.
window.onTurnstileReady = function () {};

// Render a fresh Turnstile widget into the given host on each submit —
// shown only while verifying, removed once done. Container empty on page load.
function getTurnstileToken(host) {
  return new Promise((resolve) => {
    if (!window.turnstile) {
      console.error("[waitlist] turnstile script not loaded");
      return resolve(null);
    }
    if (!host) return resolve(null);

    let widgetId = null;
    const done = (reason, token) => {
      console.info("[waitlist] turnstile", reason, token ? "(token)" : "(no token)");
      if (widgetId != null) {
        try { window.turnstile.remove(widgetId); } catch {}
      }
      while (host.firstChild) host.removeChild(host.firstChild);
      resolve(token ?? null);
    };

    // Compact (130×120) on narrow screens — the default 300px-wide widget
    // overflows the form on mobile. Flexible (auto-fit) on wider viewports.
    const narrowViewport = window.matchMedia("(max-width: 480px)").matches;
    try {
      widgetId = window.turnstile.render(host, {
        sitekey: TURNSTILE_SITEKEY,
        // Only surface a visible challenge if Cloudflare actually needs one.
        // Passive checks succeed silently; suspicious clients see the widget.
        appearance: "interaction-only",
        size: narrowViewport ? "compact" : "flexible",
        callback: (t) => done("success", t),
        "error-callback": (code) => { console.error("[waitlist] turnstile error code", code); done("error", null); },
        "expired-callback": () => done("expired", null),
        "timeout-callback": () => done("timeout", null),
      });
      if (widgetId == null || widgetId === false) {
        console.error("[waitlist] turnstile.render returned", widgetId);
        done("render-failed", null);
      }
    } catch (e) {
      console.error("[waitlist] turnstile.render threw", e);
      done("threw", null);
    }
  });
}

// Wire a waitlist form (handles validation, Turnstile, POST, UI states).
// Reused for the bottom #waitlist section and the inline hero form.
function wireWaitlist(form, msg) {
  if (!form || !msg) return;
  const turnstileHost = form.querySelector(".turnstile-container");

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const email = new FormData(form).get("email")?.toString().trim() ?? "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Please enter a valid email.";
      msg.className = `${msg.classList.contains("hero-form-msg") ? "hero-form-msg form-msg" : "form-msg"} err`;
      return;
    }

    const btn = form.querySelector('button[type="submit"], button[type="button"]') || form.querySelector('button');
    const setLoading = (on) => {
      if (!btn) return;
      btn.disabled = on;
      btn.classList.toggle("is-loading", on);
    };
    setLoading(true);
    const okClass = msg.classList.contains("hero-form-msg") ? "hero-form-msg form-msg ok" : "form-msg ok";
    const errClass = msg.classList.contains("hero-form-msg") ? "hero-form-msg form-msg err" : "form-msg err";

    try {
      if (!endpointWired) {
        console.info("[waitlist] captured (endpoint not yet wired):", email);
      } else {
        const token = await getTurnstileToken(turnstileHost);
        if (!token) {
          setLoading(false);
          msg.textContent = "Couldn't verify the request. Please refresh and try again.";
          msg.className = errClass;
          return;
        }
        const res = await fetch(WAITLIST_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email, turnstileToken: token }),
        });
        if (res.status === 429) {
          setLoading(false);
          msg.textContent = "Too many requests from your network. Try again in an hour.";
          msg.className = errClass;
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
      }
      form.classList.add("is-done");
      msg.textContent = "You're on the list. We'll be in touch soon.";
      msg.className = okClass;
      setLoading(false);
    } catch {
      setLoading(false);
      msg.textContent = "Something went wrong, try again in a moment.";
      msg.className = errClass;
    }
  });
}

wireWaitlist(document.getElementById("waitlist-form"), document.getElementById("form-msg"));
wireWaitlist(document.getElementById("hero-waitlist-form"), document.getElementById("hero-form-msg"));

// Hero CTA → in-place form reveal. First click expands the input alongside the
// button. Subsequent clicks (or Enter in the input) explicitly submit the form.
// Button stays type=button so the form never auto-submits on the open click.
const heroStage = document.getElementById("hero-cta-stage");
const heroCta = document.getElementById("hero-cta");
const heroFormEl = document.getElementById("hero-waitlist-form");

function submitForm(form) {
  if (typeof form.requestSubmit === "function") form.requestSubmit();
  else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
}

if (heroStage && heroCta && heroFormEl) {
  const input = heroFormEl.querySelector('input[type="email"]');
  const isMobile = () => window.matchMedia("(max-width: 480px)").matches;

  heroCta.addEventListener("click", (ev) => {
    ev.preventDefault();
    // Mobile shows the input from page load — first tap submits directly.
    if (isMobile() || heroStage.classList.contains("is-open")) {
      submitForm(heroFormEl);
      return;
    }
    heroStage.classList.add("is-open");
    setTimeout(() => input?.focus({ preventScroll: true }), 350);
  });

  input?.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    submitForm(heroFormEl);
  });
}

// Contact form (contact.html). Posts to a Formspree endpoint set on the <form action="">.
// Validates client-side, swaps to a success message inline (not a toast).
const contactForm = document.getElementById("contact-form");
const contactMsg = document.getElementById("contact-msg");

if (contactForm && contactMsg) contactForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const data = new FormData(contactForm);
  const name = (data.get("name") ?? "").toString().trim();
  const email = (data.get("email") ?? "").toString().trim();
  const company = (data.get("company") ?? "").toString().trim();
  const teamSize = (data.get("team_size") ?? "").toString();
  const useCase = (data.get("use_case") ?? "").toString().trim();
  const sovereignty = (data.get("sovereignty") ?? "").toString();

  const fail = (text) => {
    contactMsg.textContent = text;
    contactMsg.className = "form-msg err";
  };

  if (!name) return fail("Please add your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid work email.");
  if (!company) return fail("Please add your company.");
  if (!teamSize) return fail("Pick a team size.");
  if (useCase.length < 30) return fail("Tell us a bit more about the use case (30+ characters).");
  if (!sovereignty) return fail("Pick a sovereignty preference.");

  const action = contactForm.getAttribute("action") || "";
  const btn = contactForm.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  try {
    if (action && !action.includes("REPLACE_WITH_")) {
      const res = await fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
    } else {
      console.info("[contact] captured (endpoint not yet wired):", { name, email, company, teamSize, sovereignty });
    }
    contactForm.classList.add("is-done");
    contactMsg.textContent = "Thanks, we'll get back within a business day.";
    contactMsg.className = "form-msg ok";
  } catch {
    if (btn) btn.disabled = false;
    fail("Something went wrong, try again in a moment.");
  }
});

// ── Theme toggle ──
// The <head> bootstrap already set the initial theme before first paint (no FOUC).
// This wires the nav button: flip <html data-theme>, persist, sync browser chrome.
(function themeToggle() {
  const root = document.documentElement;
  function setChrome(theme) {
    let m = document.getElementById("theme-color-dynamic");
    if (!m) {
      m = document.createElement("meta");
      m.name = "theme-color";
      m.id = "theme-color-dynamic";
      document.head.appendChild(m);
    }
    m.setAttribute("content", theme === "light" ? "#f3f0e9" : "#0f0d12");
  }
  setChrome(root.dataset.theme === "light" ? "light" : "dark");
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      if (next === "light") root.dataset.theme = "light";
      else root.removeAttribute("data-theme");
      try { localStorage.setItem("nomik-theme", next); } catch (e) {}
      setChrome(next);
    });
  });
})();
