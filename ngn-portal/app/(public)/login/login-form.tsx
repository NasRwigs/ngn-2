"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { isSupabaseEnabled } from "@/lib/supabase/config";

import { signInWithPasswordAction } from "./actions";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    if (!email || !password) {
      setError("Email and password are required.");
      setSubmitting(false);
      return;
    }
    if (isSupabaseEnabled()) {
      const res = await signInWithPasswordAction(email, password);
      if (!res.ok) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
      router.push("/");
      router.refresh();
    } else {
      await new Promise((r) => setTimeout(r, 200));
      router.push("/");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Email" htmlFor="email" required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        required
        helper={
          <Link
            href="/reset-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        }
      >
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="pointer-events-auto size-6 grid place-items-center rounded hover:bg-surface-container"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          }
        />
      </FormField>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} fullWidth size="lg">
        Sign in
      </Button>
    </form>
  );
}
