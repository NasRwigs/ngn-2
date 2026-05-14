import Image from "next/image";

import { cn } from "./cn";

interface AvatarProps {
  src?: string | null;
  /** Used for alt text and initials fallback. */
  name: string;
  /** Pixel size; renders as a square circle. */
  size?: number;
  className?: string;
}

/**
 * Circular avatar per DESIGN.md §Shapes ("Avatars … must be 100% circular").
 * Falls back to initials on a primary-container surface when no image.
 */
export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-primary-container text-on-primary-container",
        "grid place-items-center font-medium",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, Math.round(size * 0.36)),
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span aria-hidden>{initials || "?"}</span>
      )}
      <span className="sr-only">{name}</span>
    </div>
  );
}
