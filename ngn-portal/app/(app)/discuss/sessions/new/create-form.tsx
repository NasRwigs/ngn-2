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
import { PROGRAMME_AREAS } from "@/lib/taxonomy/programme-areas";
import { EVENT_FORMATS } from "@/lib/taxonomy/statuses";
import { createGroupSessionAction } from "@/lib/actions/data-mutations";

export function CreateSessionForm() {
  const router = useRouter();
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    programmeArea: PROGRAMME_AREAS[0] as string,
    startAt: "",
    endAt: "",
    format: EVENT_FORMATS[0] as string,
    capacity: 30,
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
    try {
      await createGroupSessionAction({
        title: form.title,
        description: form.description,
        programmeArea: form.programmeArea,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        format: form.format,
        capacity: form.capacity,
      });
      toast.success("Session scheduled");
      router.push("/discuss/sessions");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card className="p-5 md:p-6 space-y-4">
        <FormField label="Title" htmlFor="title" required>
          <Input
            id="title"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
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
          <FormField label="Programme area" htmlFor="programmeArea">
            <Select
              id="programmeArea"
              value={form.programmeArea}
              onChange={(event) =>
                update("programmeArea", event.target.value)
              }
            >
              {PROGRAMME_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Format" htmlFor="format">
            <Select
              id="format"
              value={form.format}
              onChange={(event) => update("format", event.target.value)}
            >
              {EVENT_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Start" htmlFor="startAt" required>
            <Input
              id="startAt"
              type="datetime-local"
              value={form.startAt}
              onChange={(event) => update("startAt", event.target.value)}
              required
            />
          </FormField>
          <FormField label="End" htmlFor="endAt" required>
            <Input
              id="endAt"
              type="datetime-local"
              value={form.endAt}
              onChange={(event) => update("endAt", event.target.value)}
              required
            />
          </FormField>
        </div>

        <FormField label="Capacity" htmlFor="capacity">
          <Input
            id="capacity"
            type="number"
            min={1}
            value={form.capacity}
            onChange={(event) =>
              update("capacity", Number(event.target.value))
            }
          />
        </FormField>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Schedule session
        </Button>
      </div>
    </form>
  );
}
