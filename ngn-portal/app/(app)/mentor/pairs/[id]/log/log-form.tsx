"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import type { Pair } from "@/lib/data/types";

export function LogSessionForm({ pair }: { pair: Pair }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = React.useState(today);
  const [duration, setDuration] = React.useState(60);
  const [format, setFormat] = React.useState<"video" | "phone" | "in_person">(
    "video",
  );
  const [notes, setNotes] = React.useState("");
  const [discussed, setDiscussed] = React.useState<Set<string>>(new Set());
  const [wellbeing, setWellbeing] = React.useState<
    "great" | "good" | "fair" | "poor"
  >("good");
  const [submitting, setSubmitting] = React.useState(false);

  function toggleGoal(id: string) {
    setDiscussed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    toast.success("Session logged");
    router.push(`/mentor/pairs/${pair.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Session details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Date" htmlFor="date" required>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </FormField>
          <FormField
            label="Duration (minutes)"
            htmlFor="duration"
            required
          >
            <Input
              id="duration"
              type="number"
              min={15}
              max={240}
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </FormField>
        </div>

        <FormField label="Format" htmlFor="format">
          <Select
            id="format"
            value={format}
            onChange={(event) =>
              setFormat(event.target.value as typeof format)
            }
          >
            <option value="video">Video</option>
            <option value="phone">Phone</option>
            <option value="in_person">In person</option>
          </Select>
        </FormField>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">What did you discuss?</h2>

        <fieldset>
          <legend className="text-sm font-medium text-on-surface mb-2">
            Goals discussed
          </legend>
          <div className="space-y-2">
            {pair.goals.map((goal) => (
              <label
                key={goal.id}
                className="flex items-start gap-2 rounded border border-outline-variant p-3 cursor-pointer hover:bg-surface-container"
              >
                <Checkbox
                  checked={discussed.has(goal.id)}
                  onCheckedChange={() => toggleGoal(goal.id)}
                />
                <span className="text-sm text-on-surface">{goal.title}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <FormField
          label="Session notes"
          htmlFor="notes"
          helper="What was discussed and decided? Visible only to the pair."
          required
        >
          <Textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={6}
            maxLength={2000}
            showCount
          />
        </FormField>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Wellbeing</h2>
        <p className="text-sm text-on-surface-variant">
          How are you feeling about the engagement? Programme admins see
          aggregate trends only.
        </p>
        <RadioGroup
          value={wellbeing}
          onValueChange={(value) =>
            setWellbeing(value as typeof wellbeing)
          }
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {[
            { value: "great", label: "Great" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "poor", label: "Poor" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded border border-outline-variant p-3 cursor-pointer hover:bg-surface-container"
            >
              <RadioGroupItem value={opt.value} />
              <span className="text-sm text-on-surface">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          disabled={!notes}
        >
          Log session
        </Button>
      </div>
    </form>
  );
}
