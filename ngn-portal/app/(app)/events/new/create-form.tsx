"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import {
  EVENT_FORMATS,
  EVENT_TYPES,
} from "@/lib/taxonomy/statuses";
import { PROGRAMME_AREAS } from "@/lib/taxonomy/programme-areas";

export function CreateEventForm() {
  const router = useRouter();
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    programmeArea: PROGRAMME_AREAS[1] as string,
    type: EVENT_TYPES[0] as string,
    format: EVENT_FORMATS[0] as string,
    startAt: "",
    endAt: "",
    location: "",
    videoUrl: "",
    registrationRequired: true,
    capacity: 100,
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
    toast.success("Event saved as draft");
    router.push("/admin/events");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Basics</h2>

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

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Programme area" htmlFor="programmeArea">
            <Select
              id="programmeArea"
              value={form.programmeArea}
              onChange={(event) => update("programmeArea", event.target.value)}
            >
              {PROGRAMME_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Event type" htmlFor="type">
            <Select
              id="type"
              value={form.type}
              onChange={(event) => update("type", event.target.value)}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
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
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">When &amp; where</h2>

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

        {form.format !== "Virtual" && (
          <FormField label="Location" htmlFor="location">
            <Input
              id="location"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
            />
          </FormField>
        )}
        {form.format !== "In-person" && (
          <FormField label="Video link" htmlFor="videoUrl">
            <Input
              id="videoUrl"
              type="url"
              value={form.videoUrl}
              onChange={(event) => update("videoUrl", event.target.value)}
            />
          </FormField>
        )}
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Registration</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={form.registrationRequired}
            onCheckedChange={(checked) =>
              update("registrationRequired", checked === true)
            }
          />
          <span className="text-sm text-on-surface">Registration required</span>
        </label>

        {form.registrationRequired && (
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
        )}
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="outline" loading={submitting}>
          Save draft
        </Button>
        <Button type="submit" loading={submitting}>
          Publish
        </Button>
      </div>
    </form>
  );
}
