"use client";

import * as React from "react";

import type { BreadcrumbItem } from "./types";

interface Ctx {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
}

const BreadcrumbContext = React.createContext<Ctx | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<BreadcrumbItem[]>([]);
  const value = React.useMemo(() => ({ items, setItems }), [items]);
  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

/**
 * Set breadcrumbs from a client component (e.g. a route that knows the
 * entity title only at runtime). Server components should set breadcrumbs
 * via the `breadcrumbs` prop on `<AppShell>` directly.
 */
export function useBreadcrumbs(items: BreadcrumbItem[]) {
  const ctx = React.useContext(BreadcrumbContext);
  React.useEffect(() => {
    ctx?.setItems(items);
    return () => ctx?.setItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);
}

export function useBreadcrumbItems(): BreadcrumbItem[] {
  return React.useContext(BreadcrumbContext)?.items ?? [];
}
