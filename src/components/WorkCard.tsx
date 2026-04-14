import * as React from "react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Tag } from "./Tag";

export interface WorkCardProps {
  title: string;
  hook: string;
  tags: string[];
  imageUrl?: string;
  onClick?: () => void;
}

/**
 * WorkCard — 3:4 portrait case study card with 3D hover tilt.
 * Upper 55% is image/placeholder, lower 45% is title + hook, with
 * tags + explore link revealed on hover. Bottom and right edges
 * give the card physical thickness.
 */
export const WorkCard = ({ title, hook, tags, imageUrl, onClick }: WorkCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group block cursor-pointer w-full max-w-sm"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        className="relative w-full transition-transform duration-500 ease-out"
        style={{
          aspectRatio: "3 / 4",
          transformStyle: "preserve-3d",
          transform: hovered ? "rotateY(-4deg) rotateX(2deg)" : "rotateY(0) rotateX(0)",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl border border-foreground/20 bg-background flex flex-col overflow-hidden"
          style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
        >
          <div
            className="w-full bg-foreground/[0.04] border-b border-foreground/10 flex items-center justify-center overflow-hidden shrink-0"
            style={{ height: "55%" }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/25">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between flex-1 p-7">
            <div>
              <h3 className="font-sans font-medium text-[clamp(1.15rem,2.2vw,1.55rem)] text-foreground leading-[1.3] tracking-[-0.015em]">
                {title}
              </h3>
              <p className="mt-3 text-[15px] text-muted-foreground/80 font-light leading-[1.7] line-clamp-3">
                {hook}
              </p>
            </div>

            <div
              className="transition-all duration-500 ease-out"
              style={{
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0)" : "translateY(12px)",
              }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((t, i) => (
                  <Tag key={i}>{t}</Tag>
                ))}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <span className="text-[13px] font-medium">Explore</span>
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute top-0 rounded-r-sm bg-foreground/10 border-r border-foreground/15"
          style={{
            right: "-4px",
            width: "4px",
            height: "100%",
            transform: "rotateY(90deg) translateZ(0px)",
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute left-0 right-0 rounded-b-sm"
          style={{
            bottom: "-4px",
            height: "4px",
            background: "hsl(var(--foreground) / 0.08)",
            transform: "rotateX(-90deg) translateZ(0px)",
            transformOrigin: "top center",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </div>
  );
};
