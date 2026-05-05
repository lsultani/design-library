# Design System Maintenance

How to keep the three artifacts — the live website, the design-library Storybook, the Figma file, and the design-system-rules.md — in sync.

This file is the working manual. The design-system-rules.md is the AI consumption file (the contract). MAINTENANCE.md is for humans + Claude during edit cycles.

---

## The three sources of truth (and which one wins)

| Artifact | What it is | Source-of-truth role |
| --- | --- | --- |
| `lesliesultani.com` (production site) | The actual implementation | Truth for behavior, motion, real layouts |
| `library.lesliesultani.com` (Storybook from this repo) | Isolated component playground | Truth for component API and visual states |
| Figma file (zxniWcF88D1f9o57nl1xjR) | Visual reference + tokens | Truth for tokens, typography, and human-readable spec |
| `design-system-rules.md` | AI consumption contract | Truth for "how to use this system" prose |

Rule: when they drift, the design-library repo (code) wins for behavior. The Figma file wins for tokens and prose. Whichever changed first triggers the other to catch up within one sprint.

---

## When something new gets built on the website

Use this exact sequence. Either run it yourself or hand it to Claude as the prompt.

### 1. Promote the new piece into the design library

If the website has a new component, chart, motion piece, or token:

- Copy the source file from the website repo into `design-library/src/{components|charts|motion}/`.
- Strip site-only props (data, page-specific copy). Keep the component generic.
- Add a Storybook entry at `design-library/src/stories/{components|charts|motion}/<Name>.stories.tsx`.
- Run `npm run storybook` and verify the rest, hover, and edge-case states all render.
- Run `npm run build-storybook` to confirm the static build still works.

### 2. Add it to the Figma design system file

Hand Claude a prompt like:

> I added `<ComponentName>` to the design library at `src/components/<ComponentName>.tsx`. Please add it to the Figma file at https://www.figma.com/design/zxniWcF88D1f9o57nl1xjR with the same pattern as existing components on page 05 — section frame with mono label, description, and the published component frame inside.

What Claude should do (and does, when given this prompt):

- Read the new file in the repo.
- Inspect existing components on Figma page `05 · Components` (or `06 · Charts & Visuals` for charts).
- Build a frame using the same auto-layout pattern: vertical, 24px gap, `ARTICLE CARD`-style mono label, optional description.
- Bind colors to existing variables (`color/semantic/foreground`, `color/semantic/card`, etc.). Never hex.
- Use Space Grotesk + Space Mono only.
- Set the component description to a paragraph that explains: shape, behavior, key props, motion notes, what NOT to recreate in Figma.
- Insert the section into page 05 or 06 in the right alphabetical/categorical place.

### 3. Update `design-system-rules.md`

Add the component name to the "Published Figma components" or "Chart vocabulary" list. Update the count on the Figma cover if needed (60 tokens, N components).

### 4. Update the cover frame counts (if needed)

Page `00 · Cover` shows PAGES / COMPONENTS / VARIABLES / FONTS counts. If you crossed a meaningful threshold, update the count text.

### 5. Commit

```
git add src/{components|charts|motion}/<NewName>.tsx
git add src/stories/{...}/<NewName>.stories.tsx
git add design-system-rules.md
git commit -m "design-system: add <NewName>"
```

The Figma file doesn't get a commit — it has its own version history. Note the version bump in the cover (`v1.0 → v1.1`) when meaningful.

---

## When a token changes

Tokens are the most fragile piece because four things must agree:

1. `src/index.css` — runtime CSS vars (HSL)
2. `tailwind.config.ts` — Tailwind class mappings
3. The website's `src/index.css` — must be byte-identical to the design-library's
4. Figma `Sultani Tokens` collection, `Light` mode

Process:

- Change the value in the website first (because it's the live truth).
- Mirror into `design-library/src/index.css` immediately.
- Open Figma, open Variables panel, find the matching variable, update its value.
- If it's a new token: add it to all four places, AND add an entry to `design-system-rules.md` section 1.

Hand Claude this prompt:

> I changed `--foreground` from `0 0% 6%` to `0 0% 4%` in the website. Please update `design-library/src/index.css` to match, update the corresponding Figma variable in collection `Sultani Tokens` mode `Light`, and add a note to `design-system-rules.md` if this is a meaningful semantic shift.

---

## When a component is renamed or deprecated

- Rename the file in `src/components/`.
- Rename the Storybook entry.
- In Figma, rename both the section frame and the COMPONENT inside. (Component instances on Templates and Charts pages keep working — Figma updates references by ID.)
- Update `design-system-rules.md` to reflect the new name.
- If deprecated: don't delete the Figma component. Move it to a `Deprecated` page so existing instances don't break, and add `[DEPRECATED]` to its description.

---

## What lives in code only (never recreate in Figma)

- Anything in `src/motion/` — Framer Motion variants, useTime/useTransform compositions, ParticleField, DotCube, the Infographic mini-movies, Cinematic Intro burst, page transitions
- Container queries (the `cqw` units the ArticleCard uses)
- Hover state crossfades
- The continuous-motion infographic scenes

Figma should show the *rest state* of these pieces and a one-line caption pointing to the source file. This is already the pattern on page `04 · Foundations — Motion` (the Motion Spec table) and on the new ArticleCard infographic zone.

---

## What lives in Figma only (never recreate in code)

- The Cover page (00) and Spec & AI Usage page (08) — these are documentation, not implementation
- Token collections (variables) — code reads from CSS vars; Figma is the human-readable mirror
- Page templates (page 07) — these are reference layouts, not actual page components

---

## Standard prompts to give Claude

Save these as snippets:

**"Audit drift"**

> Compare `design-library/src/components/` and `design-library/src/charts/` against the Figma file at https://www.figma.com/design/zxniWcF88D1f9o57nl1xjR. List every piece of drift: components in code missing from Figma, components in Figma missing from code, token mismatches, description gaps. Don't fix anything yet — just produce the gap report.

**"Add a new component to Figma"**

> I just added `<X>` at `src/components/<X>.tsx` with a story at `src/stories/components/<X>.stories.tsx`. Read both files, then add `<X>` to the Figma file as a published component on page 05 — same pattern as Work Card. Include a description that explains the shape, key props, and any code-only behavior.

**"Sync tokens"**

> Read `design-library/src/index.css` and the Figma file's `Sultani Tokens` collection. List any variable values that differ. Fix Figma to match the code (code wins for tokens).

**"Bump version"**

> We hit a milestone — bump the design system to v<N>. Update the cover page in Figma (`v1.0 · 2026` → `v<N> · <month> 2026`), update any counts that changed, and add a v<N> entry to the bottom of `design-system-rules.md`.

---

## Cadence

- **Per-PR**: if a PR adds/changes a component, queue a Figma update task.
- **Weekly**: run "Audit drift" on Fridays. Catch what slipped.
- **Quarterly**: rerun the full inventory. Verify variable values match. Bump the minor version.
- **Annually**: re-read `design-system-rules.md` end-to-end. Prune what no longer applies.

---

## Quick reference — current state (May 2026)

Components in code: ArticleCard, Button, Divider, ImpactMetric, LinkStack, MetaBlock, NavLink, SectionHeader, Tag, WorkCard.

Charts in code: BarChart, CompressionChart, GanttTimeline, KPIGrid, LineChart, ProcessFlow, ProgressBar, QuoteBlock, StatCallout, Timeline.

Motion in code: CardGeometry, CardTilt, CinematicIntro, ConcentricRectangles, CountUp, Infographic, PageTransition, ParticleField, ScrollReveal, TickerText.

Components in Figma (as of May 2026): Button (3 variants), Tag, NavLink, SectionHeader, MetaBlock, ImpactMetric, WorkCard, **ArticleCard (added May 2026)**, LinkStack, Divider.

Charts in Figma: KPI Grid / 4-col, Bar Chart / Horizontal, Line Chart / Trend, Stat / Callout, Quote / Pull, Progress / Linear, Timeline / Horizontal.

Motion in Figma (Motion Spec table): Cinematic Intro Burst, SVG Name Stroke Draw, Hero Content Fade-in, Scroll Reveal (×4 variants), Work Card 3D Tilt, Work Card Tags Reveal, Page Transition — Slide, Count-up Metric, ParticleField, DotCube Rotation, Content Impact Shake.

### Known gaps (open queue)

| Code piece | Type | Figma status | Priority |
| --- | --- | --- | --- |
| CompressionChart | Chart | Missing | Medium — visual artifact, belongs on page 06 |
| GanttTimeline | Chart | Missing | Medium |
| ProcessFlow | Chart | Missing | Medium |
| Infographic | Motion | Partially documented (referenced from ArticleCard) | Low — motion-only, code is canonical |
| TickerText | Motion | Missing from spec table | Low |
| CardGeometry | Motion | Missing from spec table | Low |
| ConcentricRectangles | Motion | Missing from spec table (might be the "Geometric Motifs" frame) | Low |
