"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import {
  registerForEventAction,
  unregisterFromEventAction,
} from "@/lib/actions/data-mutations";

export function EventRegistrationButtons({
  eventId,
  registered,
}: {
  eventId: string;
  registered: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function toggle(nextRegistered: boolean) {
    setLoading(true);
    try {
      if (nextRegistered) {
        await registerForEventAction(eventId);
        toast.success("You are registered.");
      } else {
        await unregisterFromEventAction(eventId);
        toast.success("Registration cancelled.");
      }
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update registration.");
    }
    setLoading(false);
  }

  return registered ? (
    <Button
      variant="outline"
      loading={loading}
      onClick={() => void toggle(false)}
    >
      Cancel registration
    </Button>
  ) : (
    <Button loading={loading} onClick={() => void toggle(true)}>
      Register
    </Button>
  );
}
