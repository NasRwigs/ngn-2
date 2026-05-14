"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { COUNTRIES } from "@/lib/taxonomy/countries";
import { SECTORS } from "@/lib/taxonomy/sectors";
import type { Member } from "@/lib/data/types";
import { updateProfileAction } from "@/lib/actions/data-mutations";

interface EditProfileFormProps {
  member: Member;
}

export function EditProfileForm({ member }: EditProfileFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    name: member.name,
    title: member.title,
    organisation: member.organisation,
    country: String(member.country),
    bio: member.bio,
    sectors: [...member.sectors] as string[],
    expertise: [...member.expertise],
    languages: [...member.languages],
    linkedinUrl: member.linkedinUrl ?? "",
    websiteUrl: member.websiteUrl ?? "",
    mentorshipStatus: member.mentorshipStatus,
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSector(sector: string) {
    update(
      "sectors",
      form.sectors.includes(sector)
        ? form.sectors.filter((s) => s !== sector)
        : [...form.sectors, sector],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await updateProfileAction({
        name: form.name,
        title: form.title,
        organisation: form.organisation,
        country: form.country,
        sectors: form.sectors,
        expertise: form.expertise,
        bio: form.bio,
        languages: form.languages,
        timezone: member.timezone,
        linkedinUrl: form.linkedinUrl || undefined,
        websiteUrl: form.websiteUrl || undefined,
        mentorshipStatus: form.mentorshipStatus,
      });
      toast.success("Profile updated");
      router.push(`/connect/${member.slug}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Basics</h2>

        <FormField label="Name" htmlFor="name" required>
          <Input
            id="name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" required>
            <Input
              id="title"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
            />
          </FormField>
          <FormField label="Organisation" htmlFor="organisation" required>
            <Input
              id="organisation"
              value={form.organisation}
              onChange={(event) => update("organisation", event.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Country" htmlFor="country" required>
          <Select
            id="country"
            value={form.country}
            onChange={(event) => update("country", event.target.value)}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Languages" htmlFor="languages">
          <TagInput
            value={form.languages}
            onChange={(next) => update("languages", next)}
            ariaLabel="Languages"
          />
        </FormField>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Expertise</h2>

        <fieldset>
          <legend className="text-sm font-medium text-on-surface mb-2">
            Sectors
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {SECTORS.map((sector) => (
              <label
                key={sector}
                className="flex items-center gap-2 rounded border border-outline-variant p-3 cursor-pointer hover:bg-surface-container"
              >
                <Checkbox
                  checked={form.sectors.includes(sector)}
                  onCheckedChange={() => toggleSector(sector)}
                />
                <span className="text-sm text-on-surface">{sector}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <FormField label="Expertise tags" htmlFor="expertise">
          <TagInput
            value={form.expertise}
            onChange={(next) => update("expertise", next)}
            max={10}
            ariaLabel="Expertise tags"
          />
        </FormField>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Bio &amp; links</h2>

        <FormField label="Bio" htmlFor="bio">
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(event) => update("bio", event.target.value)}
            rows={5}
            maxLength={400}
            showCount
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="LinkedIn URL" htmlFor="linkedin">
            <Input
              id="linkedin"
              type="url"
              value={form.linkedinUrl}
              onChange={(event) => update("linkedinUrl", event.target.value)}
            />
          </FormField>
          <FormField label="Website" htmlFor="website">
            <Input
              id="website"
              type="url"
              value={form.websiteUrl}
              onChange={(event) => update("websiteUrl", event.target.value)}
            />
          </FormField>
        </div>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <h2 className="text-headline-md text-on-surface">Mentorship</h2>
        <FormField label="Mentorship availability" htmlFor="mentorship">
          <Select
            id="mentorship"
            value={form.mentorshipStatus}
            onChange={(event) =>
              update(
                "mentorshipStatus",
                event.target.value as typeof form.mentorshipStatus,
              )
            }
          >
            <option value="looking_for_mentor">Seeking a mentor</option>
            <option value="accepting_mentees">Accepting mentees</option>
            <option value="both">Both</option>
            <option value="not_now">Not now</option>
          </Select>
        </FormField>
      </Card>

      <div className="sticky bottom-20 md:bottom-0 bg-surface py-3 -mx-4 px-4 md:mx-0 md:px-0 border-t border-outline-variant flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
