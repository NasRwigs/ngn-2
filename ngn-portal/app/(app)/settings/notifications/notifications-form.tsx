"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";

interface Prefs {
  mentorship_email: boolean;
  mentorship_push: boolean;
  events_email: boolean;
  events_push: boolean;
  messages_email: boolean;
  messages_push: boolean;
  digest_weekly: boolean;
}

const SECTIONS: Array<{
  key: keyof Prefs;
  title: string;
  description: string;
}> = [
  {
    key: "mentorship_email",
    title: "Mentorship — Email",
    description: "Session reminders, intake invitations, status changes.",
  },
  {
    key: "mentorship_push",
    title: "Mentorship — Push",
    description: "In-app push for mentorship activity.",
  },
  {
    key: "events_email",
    title: "Events — Email",
    description: "Event registrations, reminders, recaps.",
  },
  {
    key: "events_push",
    title: "Events — Push",
    description: "Event reminders and new event announcements.",
  },
  {
    key: "messages_email",
    title: "Messages — Email",
    description: "New direct messages.",
  },
  {
    key: "messages_push",
    title: "Messages — Push",
    description: "Real-time notifications for new messages.",
  },
  {
    key: "digest_weekly",
    title: "Weekly digest",
    description: "A Monday summary of activity across the network.",
  },
];

const DEFAULT: Prefs = {
  mentorship_email: true,
  mentorship_push: true,
  events_email: true,
  events_push: false,
  messages_email: false,
  messages_push: true,
  digest_weekly: true,
};

export function NotificationsForm() {
  const [prefs, setPrefs] = React.useState<Prefs>(DEFAULT);
  const [submitting, setSubmitting] = React.useState(false);

  async function save() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    toast.success("Preferences saved");
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <Card className="p-5 md:p-6 divide-y divide-outline-variant">
        {SECTIONS.map((section) => (
          <div
            key={section.key}
            className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <h3 className="font-medium text-on-surface">{section.title}</h3>
              <p className="text-sm text-on-surface-variant mt-0.5">
                {section.description}
              </p>
            </div>
            <Switch
              checked={prefs[section.key]}
              onCheckedChange={(checked) =>
                setPrefs((prev) => ({ ...prev, [section.key]: checked }))
              }
              aria-label={section.title}
            />
          </div>
        ))}
      </Card>

      <div className="flex items-center justify-end">
        <Button onClick={save} loading={submitting}>
          Save preferences
        </Button>
      </div>
    </div>
  );
}
