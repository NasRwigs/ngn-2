import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";

/** Canonical absolute date format: "Oct 15, 2026". */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

/** Canonical full date+time: "Oct 15, 2026 · 14:00 GMT". */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy '·' HH:mm 'GMT'");
}

/** Canonical short time: "14:00". */
export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH:mm");
}

/** Relative timestamps: "2h ago", "Yesterday", "Mon", or absolute if older. */
export function formatRelative(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) {
    return formatDistanceToNowStrict(d, { addSuffix: true });
  }
  if (isYesterday(d)) {
    return "Yesterday";
  }
  const daysAgo = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (daysAgo < 7) {
    return format(d, "EEE");
  }
  return formatDate(d);
}

/** Timezone-aware greeting. */
export function greeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
