"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import type { Pair } from "@/lib/data/types";
import { submitIntakeAction } from "@/lib/actions/data-mutations";

interface GoalDraft {
  title: string;
  successCriteria: string;
}

export function IntakeForm({ pair }: { pair: Pair }) {
  const router = useRouter();
  const [goals, setGoals] = React.useState<GoalDraft[]>(() =>
    pair.goals.length > 0
      ? pair.goals.map((g) => ({
          title: g.title,
          successCriteria: g.successCriteria,
        }))
      : [{ title: "", successCriteria: "" }],
  );
  const [agreement, setAgreement] = React.useState("");
  const [cadence, setCadence] = React.useState(pair.cadence);
  const [submitting, setSubmitting] = React.useState(false);

  function updateGoal(index: number, patch: Partial<GoalDraft>) {
    setGoals((prev) =>
      prev.map((g, i) => (i === index ? { ...g, ...patch } : g)),
    );
  }

  function addGoal() {
    setGoals((prev) => [...prev, { title: "", successCriteria: "" }]);
  }

  function removeGoal(index: number) {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await submitIntakeAction(pair.id, {
        goals: goals
          .filter((g) => g.title.trim())
          .map((g) => ({
            title: g.title,
            successCriteria: g.successCriteria,
          })),
        workingAgreement: agreement,
        cadence,
      });
      toast.success("Intake saved");
      router.push(`/mentor/pairs/${pair.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Goals</h2>
        <p className="text-body-md text-on-surface-variant">
          Set 1–3 measurable goals for this engagement.
        </p>

        <ul className="space-y-4">
          {goals.map((goal, index) => (
            <li
              key={index}
              className="rounded-lg border border-outline-variant p-4 relative"
            >
              <div className="grid gap-3">
                <FormField
                  label={`Goal ${index + 1}`}
                  htmlFor={`goal-${index}-title`}
                  required
                >
                  <Input
                    id={`goal-${index}-title`}
                    value={goal.title}
                    onChange={(event) =>
                      updateGoal(index, { title: event.target.value })
                    }
                  />
                </FormField>
                <FormField
                  label="Success criteria"
                  htmlFor={`goal-${index}-success`}
                  required
                  helper="How will you know you've reached this goal?"
                >
                  <Textarea
                    id={`goal-${index}-success`}
                    value={goal.successCriteria}
                    onChange={(event) =>
                      updateGoal(index, { successCriteria: event.target.value })
                    }
                    rows={2}
                  />
                </FormField>
              </div>
              {goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  aria-label={`Remove goal ${index + 1}`}
                  className="absolute top-2 right-2 size-8 grid place-items-center rounded hover:bg-surface-container"
                >
                  <X className="size-4" aria-hidden />
                </button>
              )}
            </li>
          ))}
        </ul>

        {goals.length < 5 && (
          <Button type="button" variant="ghost" onClick={addGoal}>
            <Plus className="size-4" aria-hidden />
            Add another goal
          </Button>
        )}
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Working agreement</h2>
        <FormField
          label="How will you work together?"
          htmlFor="agreement"
          helper="Cadence, communication preferences, boundaries, confidentiality."
        >
          <Textarea
            id="agreement"
            value={agreement}
            onChange={(event) => setAgreement(event.target.value)}
            rows={6}
            placeholder="Example: We'll meet every other Friday at 14:00 GMT. We'll use the in-portal messages between sessions. We agree to keep all session notes confidential."
          />
        </FormField>
        <FormField label="Meeting cadence" htmlFor="cadence">
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
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Save intake
        </Button>
      </div>
    </form>
  );
}
