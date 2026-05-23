# Nomik — Website Design & Visual Identity

## Brand essence

**Nomik** is positioned as *"Slack for a hybrid workforce."* The headline is **"Your team and your agents, working as one."** The identity has to feel like a **product you'd actually run a company on**: confident, modern, technical-but-human, a little premium. The emotional target is *calm command*, "I have a whole company working for me, and I can see all of it."

**Voice:** confident, concrete, lean. Short declaratives, real specifics (named tools, real workflows), no hype filler.

**House rules:**
- No em-dashes anywhere. Use commas, periods, or a colon for bold-label bullets (`<b>Label</b>: detail`).
- Page-title separator is a middot (`Page · Nomik`).
- Mainstream startup framing, no enterprise/infra name-dropping.
- Vision-led but grounded. Don't promise mechanics that contradict the live product.

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

Six pages, one system:

| Page | Role |
|---|---|
| **Home** (`index.html`) | Narrative + demo + integrations + CTA. |
| **Product** (`product.html`) | The Warden, the org and tiers, glass box, any-model. |
| **How it works** (`how-it-works.html`) | Three moves, happy path, surfaces. |
| **Security & Sovereignty** (`security.html`) | Control surface + on-prem / local models / EU-GDPR. |
| **Pricing & Deployment** (`pricing.html`) | Model modes, deployment tiers, plan tiers, FAQ. |
| **Use cases** (`use-cases.html`) | Day-in-the-life by business type, tabbed. |

## File map

`index.html` · `product.html` · `how-it-works.html` · `security.html` · `pricing.html` · `use-cases.html` · `styles.css` · `app.js` · `logos/` · `CNAME` · `BRAND.md` (this file).
