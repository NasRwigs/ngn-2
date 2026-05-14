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
import { inviteMemberByEmailAction } from "@/lib/actions/data-mutations";

export function InviteForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("member");
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const res = await inviteMemberByEmailAction({
      email,
      name,
      role,
      note: note || undefined,
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(`Invitation sent to ${email}`);
    router.push("/admin/members");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Card className="p-5 md:p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="name" required>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </FormField>
          <FormField label="Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </FormField>
        </div>

        <FormField label="Role" htmlFor="role">
          <Select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="member">Member</option>
            <option value="ecosystem_participant">Ecosystem Participant</option>
            <option value="programme_admin">Programme Admin</option>
            <option value="foundation_staff">Foundation Staff</option>
            <option value="exco">ExCo</option>
          </Select>
        </FormField>

        <FormField
          label="Personal note (optional)"
          htmlFor="note"
          helper="Included in the invitation email."
        >
          <Textarea
            id="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
          />
        </FormField>
      </Card>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Send invitation
        </Button>
      </div>
    </form>
  );
}
