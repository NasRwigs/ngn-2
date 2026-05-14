import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "./cn";
import type { BreadcrumbItem } from "./types";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Doc2 §1.2: every page below top-level shows breadcrumbs.
 * The leaf crumb has no href and renders bold + aria-current="page".
 *
 * Server component — no interactivity needed.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="px-4 md:px-6 py-3">
      <ol className="flex items-center gap-1.5 text-sm text-on-surface-variant overflow-x-auto">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              {index > 0 && (
                <ChevronRight
                  className="size-4 shrink-0 text-outline"
                  aria-hidden
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-on-surface hover:underline focus:outline-none focus:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && "text-on-surface font-medium")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
