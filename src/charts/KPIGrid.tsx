import * as React from "react";
import { ImpactMetric } from "../components/ImpactMetric";

export interface KPI {
  value: string;
  label: string;
  caption?: string;
}

export interface KPIGridProps {
  items: KPI[];
  columns?: 2 | 3 | 4;
}

/**
 * KPI Grid — 2, 3, or 4 up ImpactMetrics in a row. Use for the
 * "Impact Metrics" section at the top of a case study.
 */
export const KPIGrid = ({ items, columns = 3 }: KPIGridProps) => {
  const col: Record<number, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };
  return (
    <div className={`grid ${col[columns]} gap-8 w-full`}>
      {items.map((it, i) => (
        <ImpactMetric key={i} {...it} />
      ))}
    </div>
  );
};
