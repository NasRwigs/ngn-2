"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";

export function CreateCircleForm() {
  const router = useRouter();
  const [form, setForm] = React.useState({
    name: "",
    topic: "",
    description: "",
    cadence: "monthly" as "weekly" | "biweekly" | "monthly",
    capacity: 10,
  });
  const [submitting, setSubmitting] = React.useState(false);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    toast.success("Circle created");
    router.push("/discuss/circles");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card className="p-5 md:p-6 space-y-4">
        <FormField label="Name" htmlFor="name" required>
          <Input
            id="name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </FormField>

        <FormField label="Topic" htmlFor="topic" required>
          <Input
            id="topic"
            value={form.topic}
            onChange={(event) => update("topic", event.target.value)}
            required
          />
        </FormField>

        <FormField label="Description" htmlFor="description" required>
          <Textarea
            id="description"
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            rows={5}
            required
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Cadence" htmlFor="cadence">
            <Select
              id="cadence"
              value={form.cadence}
              onChange={(event) =>
                update("cadence", event.target.value as typeof form.cadence)
              }
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormField>
          <FormField label="Capacity" htmlFor="capacity">
            <Input
              id="capacity"
              type="number"
              min={3}
              max={30}
              value={form.capacity}
              onChange={(event) =>
                update("capacity", Number(event.target.value))
              }
            />
          </FormField>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Create circle
        </Button>
      </div>
    </form>
  );
}
