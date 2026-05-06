import type { Meta, StoryObj } from "@storybook/react-vite";
import { default as ArticleCardDefault } from "../../components/ArticleCard";
import type { SeriesArticle } from "../../components/ArticleCard";

/**
 * ArticleCard — editorial card for the AI-Native Design Series.
 *
 * Behavior worth knowing about (and what makes this card different from
 * WorkCard):
 *
 *   • 1:1 aspect — square, deliberately shorter than a portrait card so
 *     the embedded motion infographic gets enough horizontal room without
 *     stretching the page.
 *   • Mono eyebrow shows "NO. <num>" and a section label (THE RESHAPE,
 *     THE CONTRACT, etc.). It doesn't change between rest and hover.
 *   • Top zone morphs on hover: rest shows tagline (color-split: line A
 *     in foreground, line B in muted gray) plus the article title;
 *     hover crossfades to the description paragraph in the same grid
 *     cell.
 *   • Lower zone is a continuous-motion `Infographic` keyed by `num`.
 *     The infographic plays only while the card is hovered or focused
 *     (see the Infographic story for how that works).
 *   • Hover tints the entire card background to rgba(116,116,116,0.12).
 *     Animates over 600ms with the site's signature ease-out-expo curve.
 *   • Type sizes use container query units (cqw) so the card scales with
 *     its own width regardless of viewport. Place 2 across, 3 across, 4
 *     across — the type stays proportional.
 *   • Status row at bottom shows PUBLISHED or COMING SOON. PUBLISHED
 *     cards reveal a small ↗ arrow on hover and link to the article.
 *
 * The card is the chrome around the infographic. The infographic is
 * where the storytelling happens. Both ship in this library.
 */
const meta: Meta<typeof ArticleCardDefault> = {
  title: "Components/ArticleCard",
  component: ArticleCardDefault,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Editorial card for the AI-Native Design Series. Square aspect, mono eyebrow, tagline ↔ description morph on hover, embedded continuous-motion infographic, soft gray hover tint. Type scales via container queries.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ArticleCardDefault>;

const sampleArticle: SeriesArticle = {
  num: "08",
  taglineA: "AI decides.",
  taglineB: "Humans sign off.",
  section: "THE CONTRACT",
  title: "When AI Decides and Humans Sign Off",
  description:
    "A working contract. AI is the decision support, the human is the decision maker. Four cases in law, healthcare, autonomous systems, and criminal justice show the cost.",
  status: "PUBLISHED",
  url: "https://lesliesultani.substack.com/p/when-ai-decides-and-human-signs-off",
};

const reshapeArticle: SeriesArticle = {
  num: "01",
  taglineA: "Design",
  taglineB: "changes shape.",
  section: "THE RESHAPE",
  title: "What Does Design Look Like When AI Changes Everything",
  description:
    "The opening article. The case for why the discipline of design needs to change shape, and what's at stake if it doesn't.",
  status: "PUBLISHED",
  url: "#",
};

const comingSoonArticle: SeriesArticle = {
  num: "09",
  taglineA: "Coming",
  taglineB: "next.",
  section: "THE NEXT ONE",
  title: "Article in progress",
  description:
    "Coming next. A placeholder card to show the COMING SOON treatment — non-link, status row reads in muted gray, no arrow.",
  status: "COMING SOON",
  url: null,
};

/**
 * Single card. Hover or focus to see the description morph in and the
 * infographic play.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <ArticleCardDefault article={sampleArticle} />
    </div>
  ),
};

/**
 * COMING SOON variant — non-link, muted status, no arrow on hover.
 */
export const ComingSoon: Story = {
  render: () => (
    <div className="w-[420px]">
      <ArticleCardDefault article={comingSoonArticle} />
    </div>
  ),
};

/**
 * Three across — the layout pattern used on the home page Research
 * section. Demonstrates how container-query type sizes hold up at this
 * width.
 */
export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 p-10">
      <ArticleCardDefault article={reshapeArticle} />
      <ArticleCardDefault article={sampleArticle} />
      <ArticleCardDefault article={comingSoonArticle} />
    </div>
  ),
};
