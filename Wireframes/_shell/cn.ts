/**
 * Tiny className combiner. Kept dependency-free so this package
 * doesn't pull in clsx or tailwind-merge.
 *
 * Swap for `clsx` (and optionally `tailwind-merge`) once the host app
 * adopts a convention.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
