"use client";

import * as React from "react";

import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Realtime channel seam. With Supabase configured, subscribes to postgres
 * changes when `table` + `filter` are provided; otherwise uses polling fallback.
 */
export function useRealtimeChannel(
  channelName: string,
  options: {
    pollFn?: () => Promise<unknown>;
    pollIntervalMs?: number;
    onUpdate?: () => void;
    /** e.g. `messages` */
    table?: string;
    /** e.g. `conversation_id=eq.<uuid>` */
    filter?: string;
  } = {},
) {
  const { pollFn, pollIntervalMs = 5000, onUpdate, table, filter } = options;

  React.useEffect(() => {
    if (
      isSupabaseEnabled() &&
      table &&
      filter &&
      typeof window !== "undefined"
    ) {
      let cancelled = false;
      const supabase = createSupabaseBrowserClient();
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
            filter,
          },
          () => {
            if (!cancelled) onUpdate?.();
          },
        )
        .subscribe();

      return () => {
        cancelled = true;
        void supabase.removeChannel(channel);
      };
    }

    if (!pollFn || !onUpdate) return;
    let cancelled = false;
    const tick = async () => {
      try {
        await pollFn();
        if (!cancelled) onUpdate();
      } catch {
        // ignore
      }
    };
    const id = window.setInterval(tick, pollIntervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, pollIntervalMs, table, filter]);
}
