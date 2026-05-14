"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { isSupabaseEnabled } from "@/lib/supabase/config";

import { verifyTotpAction } from "./actions";

export function VerifyMfaForm() {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [useBackup, setUseBackup] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    if (isSupabaseEnabled() && !useBackup) {
      const res = await verifyTotpAction(code);
      if (!res.ok) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 300));
      if (useBackup ? code.length < 10 : code.length !== 6) {
        setError("Invalid code. Try again.");
        setSubmitting(false);
        return;
      }
    }
    setSubmitting(false);
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label={useBackup ? "Backup code" : "6-digit code"}
        htmlFor="code"
        required
      >
        <Input
          id="code"
          inputMode={useBackup ? "text" : "numeric"}
          autoComplete="one-time-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={useBackup ? "XXXX-XXXX-XXXX" : "000000"}
          maxLength={useBackup ? 16 : 6}
          className={useBackup ? "font-mono" : "tracking-[0.5em] text-center text-lg"}
        />
      </FormField>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} fullWidth size="lg">
        Verify
      </Button>

      <p className="text-sm text-on-surface-variant text-center">
        <button
          type="button"
          onClick={() => {
            setUseBackup((v) => !v);
            setCode("");
            setError(null);
          }}
          className="text-primary hover:underline"
        >
          {useBackup
            ? "Use authenticator code"
            : "Use backup code instead"}
        </button>
      </p>

      <p className="text-sm text-on-surface-variant text-center">
        <Link href="/login" className="hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
