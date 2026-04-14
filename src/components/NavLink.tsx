import * as React from "react";

export interface NavLinkProps {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

/**
 * NavLink — mono label, wide tracking, with a small index dot for active state.
 * Used in the floating right-rail navigator on the home page.
 */
export const NavLink = ({ label, active = false, href = "#", onClick }: NavLinkProps) => (
  <a
    href={href}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}
    className="group flex items-center gap-3 py-1"
  >
    <span
      className={`block h-[1px] transition-all duration-500 ease-out ${
        active ? "w-8 bg-foreground" : "w-3 bg-foreground/30 group-hover:w-6 group-hover:bg-foreground/60"
      }`}
    />
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
        active ? "text-foreground" : "text-foreground/50 group-hover:text-foreground/80"
      }`}
    >
      {label}
    </span>
  </a>
);
