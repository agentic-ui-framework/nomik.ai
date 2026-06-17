# Nomik — Website Design & Visual Identity

## Brand essence

**Nomik** is **the system of record for AI employees**, the operating system for AI labor. Every company will employ AI workers; Nomik is where they are **hired, organized, governed, and supervised**, alongside the people you already have. The headline is **"The system of record for AI employees."** (hero eyebrow: *"The operating system for AI labor"*).

This is a **category-creation** position, not a product description. The frame: every new economic entity got its own system of record (customers → CRM, employees → HRIS, money → ERP). AI workers are the next entity, and the row is empty. Nomik owns it. The identity has to feel like the **management layer you'd run a company's AI labor on**: confident, modern, technical-but-human, a little premium. Emotional target: *calm command over a workforce*, "I employ a workforce of AI, and I can see, govern, and account for all of it."

**The five verbs (the proof spine):** Hire · Organize · Govern · Supervise · Scale. Every page should ladder back to at least one.

**Positioning against the field:** ChatGPT/Claude make one person smarter; Copilot/Cursor make one employee faster; Zapier automates workflows; Nomik **manages the workforce**. We are not another AI tool, we are the layer that manages them.

**Defuse the registry risk:** "system of record" must never read as a passive catalog over agents living in other tools. Nomik is where AI employees are **hired and run**, not just registered. Always pair the SoR claim with the fact that they're hired, run, and governed here.

**Lexicon (use consistently):** AI employees / AI workers / AI labor / AI workforce (not "bots"; "agents" only as the technical synonym, not the primary noun); manage · govern · supervise · org chart · departments · roles · budgets · permissions · accountability · "on the record". Keep the warm specifics (the Warden / Chief of Staff, named teammates, real tools, real dollars).

**Voice:** confident, concrete, lean. Short declaratives, real specifics (named tools, real workflows), no hype filler. Antithesis is the house rhetorical move ("Not a chatbot. A workforce.").

**House rules:**
- No em-dashes anywhere. Use commas, periods, or a colon for bold-label bullets (`<b>Label</b>: detail`).
- Page-title separator is a middot (`Page · Nomik`).
- Mainstream startup framing, no enterprise/infra name-dropping.
- Vision-led but grounded. Don't promise mechanics that contradict the live product. The management layer is real today (roles, autonomy dial, approvals, spend caps, kill switch, glass-box audit), reframe those strengths, don't invent new claims.

## Logo & mark

A **hexagonal node-mark** (a shield/hex outline with a single center node) set in a **blurple gradient rounded square**, beside the **Nomik** wordmark in Open Sans bold. The hex-with-a-core reads as *a network with a center*, you orchestrating the fleet.

## Color, dark and Discord-inspired

- **Theme:** dark-only.
- **Canvas:** `--gray-800` (~`hsl(223 7% 21%)`). **Cards:** `--gray-900`. **Borders:** `--gray-950`.
- **Signature color:** blurple `hsl(235 86% 65%)`. Used for primary CTAs, accents, glows, links, the mark.
- **Grayscale ramp:** `--gray-950` → `--gray-100` drives every surface and text tone (foreground ~gray-200, muted ~gray-400).
- **Status:** green working/online (with a pulse), amber connecting, red destructive. Green status dots are a recurring motif.
- **Persona accents:** a fixed HSL set (blurple, teal, green, yellow, orange, pink, purple) used for agent avatars so each "teammate" reads as an individual.

## Typography & headings

- **Open Sans** throughout (400–800). Monospace only for code, cost, handles.
- **Fluid type:** headings use `clamp()` so they scale per device, with `text-wrap: balance` for even line breaks.
- **Section heads** are **centered, constrained columns** (eyebrow chip → title → one-line subhead). Eyebrows are tiny uppercase blurple-dotted labels.

## Layout & rhythm

1120px max content width with fluid gutters; generous vertical section padding. Alternating plain / subtly-darker **band** sections create rhythm. Radius `0.75rem`, soft shadows, restrained blurple radial glows behind hero and CTA.

## Signature components & motifs

- **Slack/Discord-style chat** as the product demo: a left **channel sidebar** (workspace + #channels + agent DMs) and a message timeline. Shown as a **tab carousel** across functions (Engineering / Support / Sales / Operations).
- **Circular persona avatars** with green working-dots, the core "agent teammate" visual, reused in squads, demos, and the brand illustration.
- **Inline activity trace** chips under agent messages: *thought · tools · $cost*, the glass-box principle made visible.
- **Logo connectivity system** (the "hyper-connected" identity): logos on clean **white tiles**, shown three ways:
  - a categorized **integration directory** (masonry, vertical lists),
  - an **animated marquee** (two drifting rows),
  - a **faded, slowly-drifting logo backdrop** behind key sections, plus **foreground "sparkle" logos** floating in hero corners.
  Mainstream SaaS + AI/voice brands, shuffled per page.
- **Cards:** features, squads (with avatar stacks), steps, tier rows, pricing cards, comparison tables, FAQ accordions, all in the same dark-card language.
- **The brand illustration:** *"You, overseeing your fleet."* A glowing, crowned "You" node at top with a soft gaze cone and a half-circle of dimensional agent nodes below.

## Iconography & imagery

Thin **stroked line-icons** (currentColor, blurple), real **brand logos** on white tiles (lettermark fallbacks for brands without open logos), and decorative logo silhouettes (white, low-opacity) for backdrops.

## Motion

Subtle and purposeful: **reveal-on-scroll** fades, **marquee** scroll, **backdrop drift**, **sparkle float**, **status pulse**, hover lifts. Everything is **reduced-motion safe** (animations disabled, masks removed).

## Responsive & accessibility

Mobile-first collapse (grids → single column, sidebar hides, full-height hero scales down), a **hamburger nav** injected on mobile, tables scroll horizontally, decorative layers are `aria-hidden`, and contrast holds (logos sit on white tiles so even dark marks stay legible on the dark theme).

## Surface map

One system, many surfaces:

| Page | Role |
|---|---|
| **Home** (`index.html`) | Narrative + demo + integrations + the platform trio (Cloud · Local · Nomik-1) + CTA. |
| **Product** (`product.html`) | The Warden, the org and tiers, omnichannel + voice, glass box, any-model. |
| **How it works** (`how-it-works.html`) | Three moves, happy path, surfaces. |
| **Nomik Cloud** (`cloud.html`) | The hosted workspace product page: start solo (Chief of Staff + squad), grow into a team (members/roles/squads/approvals/audit), governance dial, "everything plugs into it" hub (connectors · Local · SDK · MCP), any-model + Nomik-1 pointer. |
| **Nomik Desktop** (`desktop.html`) | Standalone local-first agent, "the governed OpenClaw," positioned as local hands + workspace brain: safe-by-default cards, the `nomik-desktop connect` moment, two run modes, OpenClaw skill-import wedge, honest preview/roadmap framing. Renamed from "Nomik Local" 2026-06-06; `local.html` is a noindex meta-refresh stub redirecting here (GitHub Pages has no server redirects), keep it. |
| **Nomik-1 Research** (`research.html`) | Memo M-001 "Own the weights," published as written: the ongoing open-weight agent model program. §01 vision + Hermes-style lineage table, §02 five whys, §03 unit economics + bankable asset, §04 flywheel + phased route + anti-goals, §05 measured-vs-endstate + scorecard + pre-committed kill criteria. Internal paths and vendor names genericized; status pills mark running/in-build honestly. Memo-only CSS lives in a scoped `<style>` block on the page. |
| **Connectors** (`marketplace.html`) | The connector catalog: integrations directory + how connecting works (OAuth/vault/gate). Nav/footer label is "Connectors"; the file keeps its `marketplace.html` URL. |
| **Recipes** (`recipes.html`) | 1,400+ automation briefs, category browser, real recipe cards, runnable-with-your-stack, pick → Warden → runs. |
| **Skills & Prompts** (`skills.html`) | The learning loop: agents record + verify + promote procedures. Recipes-vs-skills distinction; `SKILL.md` sample. |
| **Agents** (`agents.html`) | The workforce deep dive: Nomik orchestrator, org tiers, what an agent can do, coordination, any-model, squads. |
| **Security & Sovereignty** (`security.html`) | Control surface + on-prem / local models / EU-GDPR + the "Open & sovereign" block (open-core self-host coming; Nomik-1 weights-inside-your-walls, ongoing). |
| **Pricing & Deployment** (`pricing.html`) | Model modes, deployment tiers, plan tiers, FAQ. |
| **Use cases** (`use-cases.html`) | Day-in-the-life by business type, tabbed. |
| **Developers** (`developers.html`) | The API hub: reality + roadmap split (live REST/MCP/connectors/webhooks vs coming SDK/keys/events), compact pointer cards to the SDK and MCP pages, and a Nomik Desktop cross-link. |
| **Agent SDK** (`sdk.html`) | Bring-your-own-agent page: your-brain-our-infrastructure split, TS + Python quickstart, gated `ctx.tools`, `agent.tool`, CLI, framework adapters, three connect profiles, who-plugs-in. Preview-badged, not-on-npm-yet honesty. |
| **MCP** (`mcp.html`) | Tools in (mount any server, live) · one dispatch/one gate · tools out (Nomik Desktop both ways, workspace surface coming) · why-MCP. |
| **Docs** (`docs.html`) | Developer-preview documentation hub: sticky section index + content (start, auth, API, MCP, connectors, webhooks, deploy). |

**Top nav is a Stripe-style morphing mega-menu** (declutters the bar and surfaces every page): four trigger groups — **Product ▾** (Overview · How it works · Agents · Use cases, 2-col), **Platform ▾** (Nomik Cloud · Nomik Desktop `Preview` · Nomik-1 open weights `Ongoing`), **Ecosystem ▾** (Connectors · Recipes · Skills & Prompts), **Developers ▾** (Build on Nomik · Agent SDK `Preview` · MCP · Docs, 2-col) — plus **Security** and **Pricing** flat. Each menu is **rich rows** (`.nav-row` = tinted icon · title · one-line description; pill tags via `.pill-tag`). The same `.nav-links` markup is duplicated verbatim across all pages (404 uses absolute `/` hrefs). On desktop (>1080px), `app.js initMegaNav` clones each group's `.nav-menu` into a single floating `.nav-flyout-card` that **slides + resizes between triggers** (`left`/`width`/`height` transitions) and cross-fades the active `.nav-panel`; it opens on **hover or keyboard only** (Enter/↓ moves focus into the panel, Esc closes) — mouse clicks on triggers are intentionally inert, since a click-toggle on top of hover-open closed the menu you were hovering and read as a glitch — with a ~130ms close delay bridging the hover gap. `markActiveNav` (runs first, so the clones inherit it) highlights the current page's row + group label from the URL — no per-page `class="active"`. Below 1080px the flyout is hidden and the same rows render inline in the hamburger drawer under uppercase group headers. The homepage closes with **The platform** trio (Nomik Cloud · Nomik Desktop · Nomik-1 open weights) before the waitlist CTA so all three run-modes are wired straight from the index body. Catalog counts on the site (1,400+ recipes, hundreds of integrations) must track the live product, never overstate it. **Nomik-1 is always framed as an ongoing program** (pill `Ongoing`, "release target", measured-vs-endstate split), never as shipped weights.

## File map

`index.html` · `product.html` · `how-it-works.html` · `cloud.html` · `desktop.html` · `research.html` · `marketplace.html` · `recipes.html` · `skills.html` · `agents.html` · `security.html` · `pricing.html` · `use-cases.html` · `developers.html` · `sdk.html` · `mcp.html` · `docs.html` · `local.html` (redirect stub → desktop.html) · `contact.html` · `privacy.html` · `terms.html` · `cookies.html` · `dpa.html` · `404.html` · `styles.css` · `app.js` · `logos/` · `CNAME` · `BRAND.md` (this file).

New developer pages add a small CSS block at the end of `styles.css`: `.codeblock` / `.code-card` (syntax-tinted code) and `.docs-layout` / `.docs-nav` / `.docs-section` / `.status-pill` (the docs two-column layout + live/coming pills).
