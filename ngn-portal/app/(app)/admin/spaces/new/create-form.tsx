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

export function CreateSpaceForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [programmeArea, setProgrammeArea] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    toast.success("Space created");
    router.push("/admin/spaces");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Card className="p-5 md:p-6 space-y-4">
        <FormField label="Name" htmlFor="name" required>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Description" htmlFor="description" required>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            required
          />
        </FormField>
        <FormField label="Programme area (optional)" htmlFor="programmeArea">
          <Select
            id="programmeArea"
            value={programmeArea}
            onChange={(event) => setProgrammeArea(event.target.value)}
          >
            <option value="">No programme area</option>
            {PROGRAMME_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </FormField>
      </Card>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Create space
        </Button>
      </div>
    </form>
  );
}
