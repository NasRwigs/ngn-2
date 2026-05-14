import * as React from "react";

import { cn } from "./cn";

interface DataListProps {
  items: Array<{ label: string; value: React.ReactNode }>;
  layout?: "vertical" | "horizontal";
  className?: string;
}

export function DataList({
  items,
  layout = "horizontal",
  className,
}: DataListProps) {
  return (
    <dl
      className={cn(
        layout === "horizontal"
          ? "grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-6 gap-y-2"
          : "space-y-3",
        className,
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          <dt className="text-sm text-on-surface-variant">{item.label}</dt>
          <dd className="text-sm text-on-surface">{item.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
