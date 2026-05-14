"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { toast } from "@/components/ui/toaster";

const STEPS = ["Scan QR", "Verify code", "Save backup codes"] as const;

const MOCK_ISSUER = "NGN Portal";
const MOCK_ACCOUNT = "admin@ngn.moibrahimfoundation.org";
const MOCK_SECRET = "JBSWY3DPEHPK3PXP";
const MOCK_RECOVERY = [
  "9F3K-2L4M-Q8R7",
  "T2W5-X1Y3-Z4B6",
  "K9A8-C7D2-E1F3",
  "M4N5-P6Q7-R8S9",
  "U1V2-W3X4-Y5Z6",
];

export function EnrolMfa() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [code, setCode] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const otpauthUri = React.useMemo(
    () =>
      `otpauth://totp/${encodeURIComponent(`${MOCK_ISSUER}:${MOCK_ACCOUNT}`)}?secret=${MOCK_SECRET}&issuer=${encodeURIComponent(MOCK_ISSUER)}&algorithm=SHA1&digits=6&period=30`,
    [],
  );

  function copySecret() {
    void navigator.clipboard?.writeText(MOCK_SECRET);
    toast.success("Secret copied to clipboard");
  }

  function downloadCodes() {
    const blob = new Blob([MOCK_RECOVERY.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ngn-mfa-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function verify() {
    setError(null);
    if (code.replace(/\s/g, "").length !== 6) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    setStep(2);
  }

  function finish() {
    toast.success("Two-factor authentication enabled");
    router.push("/settings");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Stepper steps={[...STEPS]} current={step} />
      </div>

      <Card className="p-5 md:p-6">
        {step === 0 && (
          <section className="space-y-4">
            <h2 className="text-headline-md text-on-surface">
              Step 1 — Scan QR with your authenticator app
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Open Authy, 1Password, or Google Authenticator and scan the QR
              code. Or paste the secret manually.
            </p>

            <div className="grid gap-6 md:grid-cols-[200px_1fr] items-start">
              <div className="rounded bg-white p-3 grid place-items-center mx-auto md:mx-0 shadow-sm border border-outline-variant w-fit">
                <QRCode
                  value={otpauthUri}
                  size={168}
                  level="M"
                  aria-label="QR code for authenticator setup"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-on-surface-variant">
                    Manual secret
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="rounded bg-surface-container px-2 py-1 font-mono text-sm">
                      {MOCK_SECRET}
                    </code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={copySecret}
                    >
                      <Copy className="size-4" aria-hidden />
                      Copy
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant">
                  Algorithm: SHA-1 · Digits: 6 · Period: 30s
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setStep(1)}>I&apos;ve scanned the code</Button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-headline-md text-on-surface">
              Step 2 — Verify a code
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Enter the 6-digit code from your authenticator app to confirm the
              link.
            </p>
            <FormField label="6-digit code" htmlFor="code" required>
              <Input
                id="code"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="tracking-[0.5em] text-center text-lg"
              />
            </FormField>

            {error && (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            )}

            <div className="pt-2 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={verify} loading={submitting}>
                Verify
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 text-success">
              <Check className="size-5" aria-hidden />
              <span className="font-medium">Verified</span>
            </div>
            <h2 className="text-headline-md text-on-surface">
              Step 3 — Save your backup codes
            </h2>
            <p className="text-body-md text-on-surface-variant">
              If you lose access to your authenticator, these codes let you sign
              in. Store them somewhere safe — you won&apos;t see them again.
            </p>
            <Card className="p-4 bg-surface-container-low">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 font-mono text-sm">
                {MOCK_RECOVERY.map((code) => (
                  <li key={code} className="rounded px-2 py-1">
                    {code}
                  </li>
                ))}
              </ul>
            </Card>
            <Button
              type="button"
              variant="outline"
              onClick={downloadCodes}
            >
              <Download className="size-4" aria-hidden />
              Download codes
            </Button>

            <div className="pt-2 flex items-center justify-end">
              <Button onClick={finish}>I&apos;ve saved my codes</Button>
            </div>
          </section>
        )}
      </Card>
    </div>
  );
}
