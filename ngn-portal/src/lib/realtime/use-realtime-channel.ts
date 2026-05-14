"use client";

import * as React from "react";

/**
 * Realtime channel seam.
 *
 * Today this is a no-op subscription that only handles the polling fallback.
 * When Supabase Realtime is added, replace the internals with a
 * `supabase.channel(channelName).on('broadcast', ...).subscribe()` call.
 * Callers don't need to change.
 */
export function useRealtimeChannel<T>(
  channelName: string,
  options: {
    pollFn?: () => Promise<T>;
    pollIntervalMs?: number;
    onUpdate?: (next: T) => void;
  } = {},
) {
  const { pollFn, pollIntervalMs = 5000, onUpdate } = options;

  React.useEffect(() => {
    if (!pollFn || !onUpdate) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const next = await pollFn();
        if (!cancelled) onUpdate(next);
      } catch {
        // ignore — surface real errors when Supabase lands
      }
    };
    const id = window.setInterval(tick, pollIntervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, pollIntervalMs]);
}
