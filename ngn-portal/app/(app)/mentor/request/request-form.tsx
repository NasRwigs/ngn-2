"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/app-shell/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import type { Member } from "@/lib/data/types";

export function RequestForm({ mentor }: { mentor: Member }) {
  const router = useRouter();
  const [motivation, setMotivation] = React.useState("");
  const [goals, setGoals] = React.useState("");
  const [cadence, setCadence] = React.useState<"weekly" | "biweekly" | "monthly">(
    "biweekly",
  );
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    toast.success(`Request sent to ${mentor.name}`);
    router.push("/mentor");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card className="p-5 flex items-center gap-4">
        <Avatar src={mentor.avatarUrl} name={mentor.name} size={56} />
        <div className="min-w-0">
          <h2 className="font-medium text-on-surface truncate">{mentor.name}</h2>
          <p className="text-sm text-on-surface-variant truncate">
            {mentor.title} · {mentor.organisation}
          </p>
        </div>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <FormField
          label="Why do you want to be mentored by them?"
          htmlFor="motivation"
          required
          helper="2-3 sentences. They'll see this."
        >
          <Textarea
            id="motivation"
            value={motivation}
            onChange={(event) => setMotivation(event.target.value)}
            rows={4}
            maxLength={500}
            showCount
            required
          />
        </FormField>

        <FormField
          label="What are your goals for this engagement?"
          htmlFor="goals"
          required
        >
          <Textarea
            id="goals"
            value={goals}
            onChange={(event) => setGoals(event.target.value)}
            rows={4}
            maxLength={500}
            showCount
            required
          />
        </FormField>

        <FormField label="Preferred cadence" htmlFor="cadence">
          <Select
            id="cadence"
            value={cadence}
            onChange={(event) =>
              setCadence(event.target.value as typeof cadence)
            }
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        </FormField>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          disabled={!motivation || !goals}
        >
          Send request
        </Button>
      </div>
    </form>
  );
}
