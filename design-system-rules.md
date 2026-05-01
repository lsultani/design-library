# Design System Rules — Leslie Sultani

AI consumption file. Read this before generating any visual, component, page, or marketing artifact in Leslie's voice. Companion to the Figma design system at https://www.figma.com/design/zxniWcF88D1f9o57nl1xjR.

---

## Voice summary

Grayscale. Editorial. Flat. Restraint is the brand. The site reads like a piece of writing, not a product UI. Space Grotesk for prose. Space Mono, uppercase, wide tracking, for labels and metadata. Every metric is backed by a label. Every label is backed by a value. Never decorate.

---

## 1. Token definitions

### Source of truth

- **Runtime tokens**: HSL custom properties in `src/index.css` (`:root` block)
- **Tailwind mappings**: `tailwind.config.ts` (`theme.extend.colors` binds CSS vars)
- **Figma variables**: `Sultani Tokens` collection, `Light` mode, in the Figma file
- **Naming convention**: `category/subcategory/name`
  - `color/primitives/ink-950`
  - `color/semantic/foreground`
  - `spacing/6` (numeric scale in 4px steps)
  - `radius/none` (default) / `radius/sm` / `radius/lg` / `radius/full`
  - `motion/duration/slow`, `motion/ease/out-expo`

### Primitives → Semantics

Components MUST consume semantic tokens (`color/semantic/foreground`), never primitives. Primitives exist for the system to map onto. If a component needs a color not in the semantic set, add a new semantic token — do not reach for a primitive.

### Color rules

- Grayscale only. Ink scale from `ink-50` (near-white #FAFAFA) to `ink-950` (near-black #0F0F0F).
- `destructive` (`hsl(0 84% 60%)`) is the only non-gray. Reserved for destructive states. Not a decorative accent.
- Opacity is the hierarchy system: `foreground @ 10%` hairlines, `@ 20%` borders, `@ 30%` dividers, `@ 60%` muted body, `@ 85%` secondary body, `@ 100%` primary. Do not introduce mid-gray primitives to avoid opacity.

### Radius rules

- **Default: 0**. The site is deliberately flat.
- Exceptions only:
  - `WorkCard` — radius 16
  - `Tag` — radius full (9999)
  - Progress-bar track — 0

### Spacing

- 4px base scale. 0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96, 128.
- Desktop content padding: 96px at 1440 width. Collapse to 32px below 1024.
- Section vertical rhythm: 96–144px padding-block.

### Motion

| Token                      | Value                                |
| -------------------------- | ------------------------------------ |
| `motion/duration/fast`     | 200ms — micro-interactions           |
| `motion/duration/base`     | 400ms — page slides, nav             |
| `motion/duration/slow`     | 800ms — scroll reveals               |
| `motion/duration/scene`    | 1200ms — hero reveals                |
| `motion/duration/swell`    | ~700ms — hover-driven motion swell (spring-controlled, not a fixed duration) |
| `motion/ease/out-expo`     | `cubic-bezier(0.16, 1, 0.3, 1)` — signature curve |
| `motion/ease/standard`     | `cubic-bezier(0.4, 0, 0.2, 1)` — everyday transitions |

Motion spec table: Figma page `04 · Foundations — Motion`, section "Motion Spec". Actual implementation lives in React components at `src/components/` — never recreate motion in Figma or from CSS alone.

### Continuous-motion pattern (cinematic, not transitional)

Used by the AI-Native Series infographics. Reach for this when motion is meant to read as cinema rather than UI feedback — when the motion *is* the artifact, not a response to user action.

Rules:

1. **No keyframes. No states. No scenes.** Every visual property is computed live every frame as a sum of pure sinusoids. `value(t) = base + Σ sin(t / period_i + phase_i) * amp_i`.
2. **Periods are incommensurate.** Use primes / near-primes (9100, 11700, 13900, 17300, 21300 ms) so no two oscillators share a common multiple. The system never returns to its starting configuration.
3. **Hover is amplitude, not state.** A spring-driven `intensity` motion value swells from 0 (rest) to 1 (hover). Every amplitude multiplies by `intensity`. At rest every sin contribution is exactly zero — composition holds still. On hover, motion fades up. There is no scene to switch to.
4. **Camera always drifts.** Wrap the piece in a parent `<motion.g>` with continuous x / scale / rotate driven by sine. Slow pan, scale, drift — never cut to a new viewpoint.
5. **No opacity 0 → 1 pops.** Elements that need to "appear" enter via translate from off-canvas, or draw themselves via `pathLength`. Opacity is reserved for trail echoes.

Implementation reference: `src/motion/Infographic.tsx`. The eight pieces inside that file are the canonical examples — port the pattern (`useTime` → `useTransform` → continuous sine-based properties), don't try to build the same thing with variant chains or keyframe arrays.

---

## 2. Component library

### Location

- `src/components/` — page-level components (`Hero`, `Navbar`, `WorkCard`, `ImpactMetrics`, `About`, `Footer`, `CinematicIntro`, `PageTransition`, `ParticleField`, `CaseStudies`, `CurrentWork`, `Organizations`)
- `src/components/ui/` — shadcn/ui base components
- `src/components/case-study/` — case-study-specific sub-components
- `src/pages/` — routed pages (`Index`, `CaseStudyPage`, `NotFound`)
- `src/pages/case-studies/` — individual case study content

### Component architecture

- React functional components with TypeScript
- Props typed with interfaces
- Scroll/intersection hooks in `src/hooks/` (`useScrollReveal`, `useCountUp`)
- Animations use CSS classes defined in `src/index.css` — reveal-fade-up, reveal-slide-left, reveal-scale-up, reveal-fade-up-slow, scroll-reveal, intro-*, slide-*
- `shadcn/ui` underpins most form/primitive components (config in `components.json`)

### Published Figma components (use these, do not re-draw)

- `Button / Primary`, `Button / Ghost`, `Button / Text`
- `Tag`
- `NavLink`
- `SectionHeader` (200px eyebrow column + heading column)
- `MetaBlock` (mono label + sentence-case value)
- `ImpactMetric` (big number + caption)
- `WorkCard` (image + title + hook + tags, radius 16)
- `ArticleCard` (1:1 square card for the AI-Native Series — mono eyebrow, tagline ↔ description morph on hover, embedded continuous-motion infographic, 12% gray hover tint, corner brackets)
- `LinkStack`
- `Divider`

### Chart vocabulary

Grayscale only. No decorative color. Density comes from typography. Hierarchy from opacity. Use these before inventing new chart types:

- `KPI Grid / 4-col` — top/bottom hairlines, 4 stat columns
- `Bar Chart / Horizontal` — left labels, foreground bars, right values, no gridlines
- `Line Chart / Trend` — single 2px line, endpoint dot, mono x-axis labels
- `Stat / Callout` — Display/Hero number + mono label + body
- `Quote / Pull` — Display/H2 + hairline rule + mono attribution
- `Progress / Linear` — 8px bar, mono label + %
- `Timeline / Horizontal` — baseline + dots + mono labels

---

## 3. Frameworks & libraries

- **React 18** + **TypeScript**
- **Vite** build system
- **Tailwind CSS** (+ `tailwindcss-animate`, `tailwind-merge`, `class-variance-authority`)
- **shadcn/ui** component base, configured via `components.json`
- **React Router** for navigation
- **Three.js** for the `ParticleField` canvas effect
- **Framer Motion** for hover-driven cinematic motion (`Infographic` and the `ArticleCard` chrome)
- **Radix UI** primitives (via shadcn)
- **Lucide React** for icons
- **Playwright** + **Vitest** for testing

---

## 4. Asset management

- Static assets: `public/` (favicons, og images)
- Project imagery at repo root (`digital-twin.png`, `en-verite.png`, `gaming.png`, `industry40.png`)
- No CDN configured — assets served directly via Vite/the host
- For AI: when adding new imagery, prefer same aspect ratios (3:4 for work card images) and grayscale/desaturated treatment to match voice

---

## 5. Icons

- Library: `lucide-react`
- Import directly: `import { ArrowUpRight } from "lucide-react"`
- Common icons in use: `ArrowUpRight` (on work cards), `Menu`, `X`
- Size inline: `<ArrowUpRight size={14} />`
- Stroke weight stays at default (1.5) — never thicken for emphasis

---

## 6. Styling approach

- Utility-first via Tailwind
- Global styles + animations in `src/index.css`
- Use Tailwind arbitrary values sparingly; prefer extending the config
- Responsive: mobile-first. Breakpoints: `sm` (640), `md` (768), `lg` (1024), `2xl` (1200 container cap)
- `cn()` helper at `src/lib/utils.ts` merges classes
- Do NOT introduce CSS Modules or styled-components — system is Tailwind-only

---

## 7. Typography

Fonts loaded via Google Fonts in `src/index.css`:

```
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
```

Figma available styles: Space Grotesk = Light/Regular/Medium/Bold. Space Mono = Regular/Bold.

### Text style map (Figma ↔ code)

| Figma style          | Weight  | Size      | Usage                                    |
| -------------------- | ------- | --------- | ---------------------------------------- |
| `Display/Hero`       | Medium  | 96px      | Hero name, single stat callouts          |
| `Display/H1`         | Medium  | 72px      | Page titles                              |
| `Display/H2-Section` | Medium  | 40px      | Section headings, pull quotes            |
| `Display/H3`         | Medium  | 28px      | Subsections, impact metric numbers       |
| `Display/H4-Card`    | Medium  | 22px      | Work card titles                         |
| `Body/Lead`          | Light   | 18px      | Opening paragraphs                       |
| `Body/Regular`       | Regular | 16px      | Default body copy                        |
| `Body/Small`         | Regular | 15px      | Secondary copy, links                    |
| `Body/Caption`       | Regular | 13px      | Footnotes, metric labels                 |
| `Mono/Label`         | Bold    | 12px      | Section eyebrows (UPPERCASE)             |
| `Mono/Label-Small`   | Regular | 10px      | Meta labels (UPPERCASE)                  |
| `Mono/Tag`           | Regular | 10px      | Work card tags (UPPERCASE)               |
| `Mono/Navigation`    | Regular | 10px      | Nav links (UPPERCASE)                    |

---

## 8. Project structure

```
src/
  components/
    ui/              ← shadcn primitives
    case-study/      ← case study sub-components
    Hero.tsx
    Navbar.tsx
    WorkCard.tsx
    ImpactMetrics.tsx
    About.tsx
    CinematicIntro.tsx
    PageTransition.tsx
    ParticleField.tsx
    ...
  pages/
    Index.tsx
    CaseStudyPage.tsx
    NotFound.tsx
    case-studies/
  hooks/
    useScrollReveal.ts
    useCountUp.ts
  lib/
    utils.ts         ← cn() helper
  App.tsx
  main.tsx
  index.css          ← CSS vars + animations
```

---

## 9. AI agent instructions

When generating any new visual for Leslie:

1. **Default to this design system. Do not invent.** Start from the closest template (Figma page 07) or component (Figma page 05).
2. **Charts**: use the chart vocabulary on Figma page 06. Grayscale only. Mono labels. No gridlines, no legend unless essential.
3. **Typography**: all text styles must come from the Typography panel. No custom weights or sizes.
4. **Color**: all colors from Semantic tokens. Never from hex. Never from primitives.
5. **Motion**: reference the Motion Spec table (Figma page 04). Use the named code component. Never recreate animations in Figma or from scratch in CSS.
6. **New components**: publish with a description. Descriptions are the contract for AI consumption.
7. **Radius**: 0 by default. If you're rounding something, justify why.
8. **Never introduce**: new colors, gradients, shadows (except WorkCard edge thickness), non-Space-Grotesk sans, non-Space-Mono mono, sentence-case mono labels.

---

## 10. Versioning

- v1.0 — 2026.04. Initial system extraction from the live site.
- Source of truth: this Figma file. When the site changes, the Figma changes first (or simultaneously), then code catches up. When code changes first in a rush, retrofit Figma within one sprint.
- This rules file lives at the repo root and should be read by any AI agent before producing work in Leslie's voice.
