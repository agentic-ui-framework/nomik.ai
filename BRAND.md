# Nomik — Website Design & Visual Identity

## Brand essence

**Nomik** is **AI Labor Infrastructure**: the operating system for AI labor. The headline is **"Every company will run on AI labor."** (hero eyebrow: *"AI Labor Infrastructure"*). Nomik is the operating system that **deploys, allocates, governs, and observes** that labor across a company.

This is a **category-creation** position, not a product description, resting on two truths. First, **labor is becoming software**: "for the first time in history, labor is becoming software", which makes work deployable, scalable, measurable, programmable, and abundant. Second, **abundance breaks management**: every org chart, headcount plan, and approval chain was built for a world where labor is *scarce* (a manager can supervise ~10 people, not 5,000 AI workers), and none of them scale. Nomik is the operating system for managing labor once it's no longer scarce. (Capital, people, and software were the resources companies ran on; AI labor is the fourth.)

**Stage into the bigger category (don't overclaim it).** Own **"AI labor"** today: uncontested, demoable, no Workday/Rippling collision, and a job the product actually does. The endgame is **one workforce, human and AI, on the same org chart**, so Nomik *earns* "Workforce Infrastructure" as it expands rather than claiming a human-labor-management job it doesn't do yet. The identity has to feel like the **infrastructure layer every company will run on once AI workers outnumber humans**: confident, modern, technical-but-human, a little premium. Emotional target: *calm command over a new resource*, "my company runs on AI labor, and I can see, govern, and account for all of it."

**The five verbs (the proof spine):** Deploy · Allocate · Govern · Observe · Scale. **Allocate** is the strategic core: the CEO's actual job is *deciding where intelligence should be spent*, and almost nobody in AI names it, so we own it. "Deploy" not "hire" (AI labor is created and deployed, not recruited, interviewed, or onboarded); "Observe" is the glass box (every action visible and on the record). Every page should ladder back to at least one.

**Positioning against the field (two tiers):** *Tools* (ChatGPT/Claude make one person smarter; Copilot/Cursor make one employee faster; Zapier automates workflows) and *agent builders* (Lindy, CrewAI, Manus, Devin, … give you one agent at a time, wired by hand). Nomik is **the layer above both**: the infrastructure that deploys, governs, and allocates a company's entire AI labor pool. Agents are an implementation detail underneath it. **Why not the labs (OpenAI, Anthropic, Microsoft):** they *create* intelligence; Nomik *allocates* it. They build models and workers; Nomik builds the management system that runs the workforce. Keep the distinction visible: *"The labs create intelligence. Nomik allocates it."*

**Lexicon, three tiers (use deliberately):** (1) **AI labor** is the top frame, the resource and the economy, lead the hero/thesis/category with it. (2) **AI workforce** is a company's allocation of that labor. (3) **AI employees / agents** are the concrete units, the proof layer, kept warm and demoable (named teammates, real tools, real dollars), never the top-level claim. Not "bots". Verbs: deploy · allocate · govern · observe · scale · "on the record". Keep the Chief of Staff (Nomik) and the demo concrete so the big frame never floats into vapor. Investor shorthand: **"Workday, Active Directory, and AWS for AI labor."**

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
| **Product** (`product.html`) | Nomik (the Chief of Staff), the org and tiers, omnichannel + voice, glass box, any-model. |
| **How it works** (`how-it-works.html`) | Three moves, happy path, surfaces. |
| **Nomik Cloud** (`cloud.html`) | The hosted workspace product page: start solo (Chief of Staff + squad), grow into a team (members/roles/squads/approvals/audit), governance dial, "everything plugs into it" hub (connectors · Local · SDK · MCP), any-model + Nomik-1 pointer. |
| **Nomik Desktop** (`desktop.html`) | Standalone local-first agent, "the governed OpenClaw," positioned as local hands + workspace brain: safe-by-default cards, the `nomik-desktop connect` moment, two run modes, OpenClaw skill-import wedge, honest preview/roadmap framing. Renamed from "Nomik Local" 2026-06-06; `local.html` is a noindex meta-refresh stub redirecting here (GitHub Pages has no server redirects), keep it. |
| **Nomik-1 Research** (`research.html`) | Memo M-001 "Own the weights," published as written: the ongoing open-weight agent model program. §01 vision + Hermes-style lineage table, §02 five whys, §03 unit economics + bankable asset, §04 flywheel + phased route + anti-goals, §05 measured-vs-endstate + scorecard + pre-committed kill criteria. Internal paths and vendor names genericized; status pills mark running/in-build honestly. Memo-only CSS lives in a scoped `<style>` block on the page. |
| **Connectors** (`marketplace.html`) | The connector catalog: integrations directory + how connecting works (OAuth/vault/gate). Nav/footer label is "Connectors"; the file keeps its `marketplace.html` URL. |
| **Recipes** (`recipes.html`) | 1,400+ automation briefs, category browser, real recipe cards, runnable-with-your-stack, pick → Nomik → runs. |
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
