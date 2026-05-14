import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "./cn";

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-sm text-on-surface-variant",
        "hover:text-on-surface hover:underline",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
        className,
      )}
    >
      <ChevronLeft className="size-4" aria-hidden />
      {children}
    </Link>
  );
}
