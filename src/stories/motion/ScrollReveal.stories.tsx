import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollReveal, type RevealVariant } from "../../motion/ScrollReveal";

const meta: Meta<typeof ScrollReveal> = {
  title: "Motion/ScrollReveal",
  component: ScrollReveal,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Wrap any content to get the site's standard scroll-triggered animation. The three variants (fade-up, slide-left, scale-up) are the ones used in production on IntroStatement, Work, Research, and About sections.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ScrollReveal>;

const Demo = ({ variant }: { variant: RevealVariant }) => {
  const [key, setKey] = useState(0);
  return (
    <div className="flex flex-col gap-6 items-start">
      <button
        onClick={() => setKey((k) => k + 1)}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground border border-foreground/20 hover:border-foreground/60 px-4 py-2 transition-colors"
      >
        Replay
      </button>
      <ScrollReveal key={key} variant={variant} playOnMount>
        <div className="border border-foreground/20 bg-card/50 p-10 rounded-[2px] max-w-[480px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 mb-3">
            Variant — {variant}
          </p>
          <h3 className="text-[24px] font-medium tracking-[-0.02em] text-foreground">
            The system didn't replace judgment. It removed the time we used to spend re-solving the same five problems.
          </h3>
        </div>
      </ScrollReveal>
    </div>
  );
};

export const FadeUp: Story = { render: () => <Demo variant="fade-up" /> };
export const SlideLeft: Story = { render: () => <Demo variant="slide-left" /> };
export const ScaleUp: Story = { render: () => <Demo variant="scale-up" /> };
