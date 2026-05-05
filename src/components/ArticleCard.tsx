/**
 * Editorial card for an AI-Native Design Series article.
 *
 * Two-state morph driven by Framer Motion variants:
 *   rest  → tagline (color-split) + article title in the top zone
 *   hover → description paragraph in the same top zone (crossfade)
 *
 * The infographic in the bottom zone reads variants from the parent and
 * plays a choreographed motion-design "mini movie" expressing the core
 * theme of the article — see Infographics.tsx for the per-article scenes.
 *
 * Type sizes use container query units (cqw) so the card type scales with
 * the card's own width regardless of viewport.
 */
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Infographic from "../motion/Infographic";

export interface SeriesArticle {
  num: string;
  taglineA: string;
  taglineB: string;
  section: string;
  title: string;
  description: string;
  status: "PUBLISHED" | "COMING SOON";
  url: string | null;
}

const defaultStateVariants: Variants = {
  rest: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  hover: { opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};
const hoverStateVariants: Variants = {
  rest: { opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  hover: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 } },
};
const arrowVariants: Variants = {
  rest: { opacity: 0, x: -4, y: 4 },
  hover: { opacity: 1, x: 0, y: 0, transition: { delay: 0.2, duration: 0.4 } },
};

// Card background tints to a subtle gray on hover.
const wrapperBgVariants: Variants = {
  rest: { backgroundColor: "rgba(224, 224, 224, 1)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  hover: { backgroundColor: "rgba(116, 116, 116, 0.12)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const ArticleCard = ({ article }: { article: SeriesArticle }) => {
  const isLink = article.status !== "COMING SOON" && article.url;
  const Wrapper: any = isLink ? motion.a : motion.div;
  const [hovered, setHovered] = useState(false);
  const wrapperProps = isLink
    ? {
        href: article.url!,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      variants={wrapperBgVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group block relative aspect-[1/1] text-[#0F0F0F] focus-visible:outline-2 focus-visible:outline-[#0F0F0F] focus-visible:outline-offset-2"
      style={{ containerType: "inline-size", backgroundColor: "#E0E0E0" }}
    >
      <CornerBrackets />

      <div className="absolute inset-0 flex flex-col px-[7.78%] pt-[8%] pb-[5%]">
        {/* Top hairline */}
        <div className="h-[2px] bg-[#0F0F0F] w-full mb-[2.2%]" />

        {/* Eyebrow row — stays constant in both states */}
        <div
          className="flex items-baseline justify-between font-mono uppercase tracking-[0.2em] text-[#0F0F0F]"
          style={{ fontSize: "max(9px, 2.5cqw)" }}
        >
          <span>NO. {article.num}</span>
          <span>{article.section}</span>
        </div>

        {/* Morph zone — crossfade tagline+title ↔ description */}
        <div className="grid mt-[8%] flex-shrink-0">
          <motion.div
            variants={defaultStateVariants}
            style={{ gridArea: "1 / 1" }}
          >
            <h3 className="font-sans font-bold tracking-[-0.03em] leading-[1]">
              <span className="block text-[#0F0F0F]" style={{ fontSize: "max(26px, 9cqw)" }}>
                {article.taglineA}
              </span>
              <span className="block text-[#737373]" style={{ fontSize: "max(26px, 9cqw)" }}>
                {article.taglineB}
              </span>
            </h3>
            <p
              className="font-sans font-medium tracking-[-0.01em] leading-[1.3] mt-[5%] text-[#0F0F0F]"
              style={{ fontSize: "max(11px, 3cqw)" }}
            >
              {article.title}
            </p>
          </motion.div>

          <motion.div
            variants={hoverStateVariants}
            style={{ gridArea: "1 / 1" }}
            className="flex items-center"
          >
            <p
              className="font-sans font-light tracking-[-0.015em] leading-[1.45] text-[#0F0F0F]"
              style={{ fontSize: "max(13px, 4cqw)" }}
            >
              {article.description}
            </p>
          </motion.div>
        </div>

        {/* Mid divider */}
        <div className="h-[2px] bg-[#0F0F0F] w-full mt-[5%]" />

        {/* Infographic — mini-movie plays via variants from parent */}
        <div className="flex-1 mt-[3.5%] relative">
          <Infographic
            num={article.num}
            hovered={hovered}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Status row */}
        <div
          className="flex items-baseline justify-between mt-[2%] font-mono font-bold uppercase tracking-[0.2em]"
          style={{ fontSize: "max(8px, 2cqw)" }}
        >
          <span
            className={
              article.status === "COMING SOON"
                ? "text-[#737373]"
                : "text-[#0F0F0F]"
            }
          >
            {article.status}
          </span>
          {isLink && (
            // "Read" + arrow CTA on hover/focus. Mirrors the "Explore" + arrow
            // pattern on WorkCard / CaseStudies / WorkCarousel — sans medium,
            // sentence case, sized to feel like a call-to-action rather than
            // a system label. Overrides the parent row's mono / uppercase /
            // tracked styling for just this group.
            <motion.span
              variants={arrowVariants}
              className="inline-flex items-center gap-1.5 font-sans font-medium normal-case tracking-normal"
              style={{ fontSize: "max(11px, 3cqw)" }}
            >
              <span>Read</span>
              <ArrowUpRight size={14} strokeWidth={2} />
            </motion.span>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

// CSS-positioned brackets so they stay crisp and consistent at any aspect ratio.
const CornerBrackets = () => (
  <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
    {/* Top-left */}
    <span className="absolute top-3 left-3 w-4 h-px bg-[#0F0F0F]" />
    <span className="absolute top-3 left-3 w-px h-4 bg-[#0F0F0F]" />
    {/* Top-right */}
    <span className="absolute top-3 right-3 w-4 h-px bg-[#0F0F0F]" />
    <span className="absolute top-3 right-3 w-px h-4 bg-[#0F0F0F]" />
    {/* Bottom-left */}
    <span className="absolute bottom-3 left-3 w-4 h-px bg-[#0F0F0F]" />
    <span className="absolute bottom-3 left-3 w-px h-4 bg-[#0F0F0F]" />
    {/* Bottom-right */}
    <span className="absolute bottom-3 right-3 w-4 h-px bg-[#0F0F0F]" />
    <span className="absolute bottom-3 right-3 w-px h-4 bg-[#0F0F0F]" />
  </div>
);

export default ArticleCard;
