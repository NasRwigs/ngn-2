/**
 * Tiny i18n seam. Today every key is the English string. Later this can
 * be swapped for next-intl / react-intl without changing callsites.
 */

const en = new Map<string, string>();

export function t(key: string, fallback?: string): string {
  return en.get(key) ?? fallback ?? key;
}
