# LeslieSultani.com Design Library

Live companion to the [LeslieSultani.com Design System Figma file](https://www.figma.com/design/zxniWcF88D1f9o57nl1xjR).

This is the part of the design system that can't fit inside Figma — the
motion, the hover states, the count-ups — rendered as running code. It
exists so readers of the **AI Native Design** articles can see the three-layer
architecture in practice:

1. **Shape** — the Figma file
2. **Motion & behavior** — this Storybook
3. **Rules** — `design-system-rules.md`

## Running it locally

```bash
cd library
npm install
npm run storybook
```

Storybook opens at `http://localhost:6006`.

## Building a static site

```bash
npm run build-storybook
```

Outputs to `library/storybook-static/`. Drag that folder into Vercel,
Netlify, or GitHub Pages — or any static host. Suggested deploy paths:

- `library.lesliesultani.com` — as a subdomain
- `lesliesultani.com/library` — as a subpath (configure base in Vercel)

## What's inside

```
library/
├── .storybook/        Storybook config + font loader
├── src/
│   ├── index.css      Tokens + motion CSS (mirrors the site)
│   ├── components/    Button, Tag, WorkCard, ArticleCard, ImpactMetric,
│   │                  NavLink, MetaBlock, SectionHeader, LinkStack, Divider
│   ├── charts/        KPIGrid, BarChart, LineChart, QuoteBlock,
│   │                  Timeline, StatCallout, ProgressBar
│   ├── motion/        CinematicIntro, ScrollReveal, CardTilt, CountUp,
│   │                  Infographic (continuous time-driven cinematic motion)
│   └── stories/       MDX docs + .stories.tsx examples
├── tailwind.config.ts
├── postcss.config.js
└── package.json
```

## Relationship to the main site

Components here are **intentionally copies**, not imports, of `/src/components/…`.
The reason: the main site uses React Router and ships full-site behavior.
The library ships each component in isolation so you can see it without
the rest of the page. When the main site changes a token or behavior,
update both places and keep them in sync.

If a component exists in the main site but not here, it's either (a) a
page-specific layout that wouldn't read out of context, or (b) on the
backlog — add it.

## AI agents reading this

See [`Welcome/Rules (for AI and humans)`](http://localhost:6006/?path=/docs/welcome-rules-for-ai-and-humans--docs) inside Storybook,
or read the source at `src/stories/welcome/Rules.mdx`. The full rules live at
`design-system-rules.md` at the repo root.
