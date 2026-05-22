"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { OnboardingWizardStepper } from "@/components/ui/stepper";
import { TagInput } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES } from "@/lib/taxonomy/countries";
import { SECTORS } from "@/lib/taxonomy/sectors";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { toast } from "@/components/ui/toaster";

import {
  MIN_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH_HINT,
  passwordMeetsMinLength,
} from "@/lib/auth/password";

import { signUpFromOnboardingAction } from "./actions";

const ONBOARDING_STEPS = [
  {
    stepperLabel: "Account",
    title: "Set up your account",
    description:
      "Let's get started by creating your login credentials to join the next generation network.",
  },
  {
    stepperLabel: "Identity",
    title: "Basic identity",
    description:
      "Tell us the basics about you. You can edit any of this later in your profile.",
  },
  {
    stepperLabel: "Professional",
    title: "Professional context",
    description:
      "Pick your sectors and add the skills people should know you for.",
  },
  {
    stepperLabel: "Mentorship",
    title: "Mentorship preferences",
    description:
      "Set your default availability for the mentorship programme.",
  },
  {
    stepperLabel: "Story",
    title: "Your story",
    description:
      "Introduce yourself to the network with a short bio and optional links.",
  },
] as const;

const STEPPER_LABELS = ONBOARDING_STEPS.map((s) => s.stepperLabel);

interface State {
  email: string;
  password: string;
  name: string;
  country: string;
  nationality: string;
  title: string;
  organisation: string;
  languages: string[];
  timezone: string;
  sectors: string[];
  expertise: string[];
  mentorshipStatus: "accepting_mentees" | "looking_for_mentor" | "both" | "not_now";
  cadence: "weekly" | "biweekly" | "monthly";
  skillsOffered: string[];
  skillsWanted: string[];
  bio: string;
  linkedinUrl: string;
  websiteUrl: string;
}

const DEFAULT_STATE: State = {
  email: "",
  password: "",
  name: "",
  country: "",
  nationality: "",
  title: "",
  organisation: "",
  languages: [],
  timezone: "Africa/Lagos",
  sectors: [],
  expertise: [],
  mentorshipStatus: "looking_for_mentor",
  cadence: "biweekly",
  skillsOffered: [],
  skillsWanted: [],
  bio: "",
  linkedinUrl: "",
  websiteUrl: "",
};

const STORAGE_KEY = "ngn_onboarding_v1";

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState<State>(DEFAULT_STATE);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { state: State; step: number };
        setState(parsed.state);
        setStep(parsed.step);
      }
    } catch {
      // ignore corrupt cache
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state, step }),
      );
    } catch {
      // ignore — incognito etc
    }
  }, [state, step]);

  function update<K extends keyof State>(key: K, value: State[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (step < ONBOARDING_STEPS.length - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function submit() {
    setSubmitting(true);
    try {
      if (isSupabaseEnabled()) {
        const res = await signUpFromOnboardingAction({
          email: state.email,
          password: state.password,
          name: state.name,
          country: state.country,
          nationality: state.nationality,
          title: state.title,
          organisation: state.organisation,
          sectors: state.sectors,
          expertise: state.expertise,
          bio: state.bio,
          languages: state.languages,
          timezone: state.timezone,
          linkedinUrl: state.linkedinUrl || undefined,
          websiteUrl: state.websiteUrl || undefined,
          mentorshipStatus: state.mentorshipStatus,
          skillsOffered: state.skillsOffered,
          skillsWanted: state.skillsWanted,
          cadence: state.cadence,
        });
        if (!res.ok) {
          toast.error(res.error);
          setSubmitting(false);
          return;
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      setSubmitting(false);
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-dvh grid place-items-center p-6 bg-afro-pattern">
        <Card className="max-w-md p-8 text-center" accent="blue">
          <div className="size-14 mx-auto rounded-full bg-success-container grid place-items-center">
            <CheckCircle2 className="size-7 text-success" aria-hidden />
          </div>
          <h1 className="mt-4 text-headline-md text-on-surface">
            You&apos;re in.
          </h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Your account is being set up. We&apos;ll redirect you to sign in.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <header className="px-4 md:px-8 py-4 border-b border-outline-variant">
        <div className="container-content flex items-center justify-between">
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 font-bold text-on-surface"
          >
            <div className="size-7 rounded bg-primary text-on-primary grid place-items-center font-bold text-sm">
              N
            </div>
            <span className="hidden sm:inline">NGN Portal</span>
          </Link>
          <Link
            href="/login"
            className="text-sm text-on-surface-variant hover:underline"
          >
            Sign in instead
          </Link>
        </div>
      </header>

      <div className="container-content px-4 md:px-8 py-6">
        <OnboardingWizardStepper steps={STEPPER_LABELS} current={step} />
      </div>

      <main className="flex-1 px-4 md:px-8 pb-8">
        <div className="container-content max-w-2xl">
          <Card className="p-6 md:p-8">
            {step === 0 && <StepAccount state={state} update={update} />}
            {step === 1 && <StepAbout state={state} update={update} />}
            {step === 2 && <StepExpertise state={state} update={update} />}
            {step === 3 && <StepMentorship state={state} update={update} />}
            {step === 4 && <StepBio state={state} update={update} />}
          </Card>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={back}
              disabled={step === 0}
              className={step === 0 ? "invisible" : ""}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>

            {step < ONBOARDING_STEPS.length - 1 ? (
              <Button onClick={next} disabled={!isStepValid(step, state)}>
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button
                onClick={submit}
                loading={submitting}
                disabled={!isStepValid(step, state)}
              >
                Create account
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StepAccount({
  state,
  update,
}: {
  state: State;
  update: <K extends keyof State>(key: K, value: State[K]) => void;
}) {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-headline-md text-on-surface">Set up your account</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          We&apos;ll use this to sign you in.
        </p>
      </header>
      <FormField label="Email" htmlFor="email" required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={(event) => update("email", event.target.value)}
          required
        />
      </FormField>
      <FormField
        label="Password"
        htmlFor="password"
        required
        helper={MIN_PASSWORD_LENGTH_HINT}
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={state.password}
          onChange={(event) => update("password", event.target.value)}
          required
          minLength={MIN_PASSWORD_LENGTH}
        />
      </FormField>
    </section>
  );
}

function StepAbout({
  state,
  update,
}: {
  state: State;
  update: <K extends keyof State>(key: K, value: State[K]) => void;
}) {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-headline-md text-on-surface">About you</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Tell us the basics. You can edit any of this later.
        </p>
      </header>

      <FormField label="Full name" htmlFor="name" required>
        <Input
          id="name"
          value={state.name}
          onChange={(event) => update("name", event.target.value)}
          required
        />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Country" htmlFor="country" required>
          <Select
            id="country"
            value={state.country}
            onChange={(event) => update("country", event.target.value)}
            required
          >
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Nationality" htmlFor="nationality" required>
          <Select
            id="nationality"
            value={state.nationality}
            onChange={(event) => update("nationality", event.target.value)}
            required
          >
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Job title" htmlFor="title" required>
        <Input
          id="title"
          value={state.title}
          onChange={(event) => update("title", event.target.value)}
          required
        />
      </FormField>

      <FormField label="Organisation" htmlFor="organisation" required>
        <Input
          id="organisation"
          value={state.organisation}
          onChange={(event) => update("organisation", event.target.value)}
          required
        />
      </FormField>

      <FormField label="Languages" htmlFor="languages">
        <TagInput
          value={state.languages}
          onChange={(next) => update("languages", next)}
          placeholder="Add language…"
          suggestions={["English", "French", "Arabic", "Portuguese", "Swahili", "Hausa", "Yoruba", "Igbo"]}
          ariaLabel="Languages"
        />
      </FormField>
    </section>
  );
}

function StepExpertise({
  state,
  update,
}: {
  state: State;
  update: <K extends keyof State>(key: K, value: State[K]) => void;
}) {
  function toggleSector(sector: string) {
    if (state.sectors.includes(sector)) {
      update("sectors", state.sectors.filter((s) => s !== sector));
    } else {
      update("sectors", [...state.sectors, sector]);
    }
  }

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-headline-md text-on-surface">Your expertise</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Pick your sectors and add the skills people should know you for.
        </p>
      </header>

      <fieldset>
        <legend className="text-sm font-medium text-on-surface mb-2">
          Sectors <span className="text-error">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {SECTORS.map((sector) => (
            <label
              key={sector}
              className="flex items-center gap-2 rounded border border-outline-variant p-3 cursor-pointer hover:bg-surface-container"
            >
              <Checkbox
                checked={state.sectors.includes(sector)}
                onCheckedChange={() => toggleSector(sector)}
              />
              <span className="text-sm text-on-surface">{sector}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <FormField
        label="Expertise tags"
        htmlFor="expertise"
        helper="Up to 10 tags. Other members can filter by these."
      >
        <TagInput
          value={state.expertise}
          onChange={(next) => update("expertise", next)}
          placeholder="Add a skill or topic…"
          max={10}
          ariaLabel="Expertise tags"
          suggestions={[
            "Public Policy",
            "Climate Adaptation",
            "Fintech",
            "Product Strategy",
            "Engineering Leadership",
            "Mentorship",
            "Editorial",
            "Impact Investing",
          ]}
        />
      </FormField>
    </section>
  );
}

function StepMentorship({
  state,
  update,
}: {
  state: State;
  update: <K extends keyof State>(key: K, value: State[K]) => void;
}) {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-headline-md text-on-surface">Mentorship preferences</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Set your default availability for the mentorship programme.
        </p>
      </header>

      <fieldset>
        <legend className="text-sm font-medium text-on-surface mb-2">
          I&apos;m available as a&hellip;
        </legend>
        <RadioGroup
          value={state.mentorshipStatus}
          onValueChange={(value) =>
            update("mentorshipStatus", value as State["mentorshipStatus"])
          }
          className="space-y-2"
        >
          {[
            { value: "looking_for_mentor", label: "Mentee — I'm seeking a mentor" },
            { value: "accepting_mentees", label: "Mentor — I'd like to mentor others" },
            { value: "both", label: "Both" },
            { value: "not_now", label: "Not now" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 rounded border border-outline-variant p-3 cursor-pointer hover:bg-surface-container"
            >
              <RadioGroupItem value={opt.value} />
              <span className="text-sm text-on-surface">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      {state.mentorshipStatus !== "not_now" && (
        <>
          <FormField label="Preferred cadence" htmlFor="cadence">
            <Select
              id="cadence"
              value={state.cadence}
              onChange={(event) =>
                update("cadence", event.target.value as State["cadence"])
              }
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormField>

          {(state.mentorshipStatus === "accepting_mentees" ||
            state.mentorshipStatus === "both") && (
            <FormField
              label="Skills I can offer"
              htmlFor="skills-offered"
              helper="What can you teach or coach on?"
            >
              <TagInput
                value={state.skillsOffered}
                onChange={(next) => update("skillsOffered", next)}
                ariaLabel="Skills I can offer"
              />
            </FormField>
          )}

          {(state.mentorshipStatus === "looking_for_mentor" ||
            state.mentorshipStatus === "both") && (
            <FormField
              label="Skills I want to develop"
              htmlFor="skills-wanted"
              helper="What are you hoping to learn?"
            >
              <TagInput
                value={state.skillsWanted}
                onChange={(next) => update("skillsWanted", next)}
                ariaLabel="Skills I want to develop"
              />
            </FormField>
          )}
        </>
      )}
    </section>
  );
}

function StepBio({
  state,
  update,
}: {
  state: State;
  update: <K extends keyof State>(key: K, value: State[K]) => void;
}) {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-headline-md text-on-surface">Bio &amp; links</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          A short bio helps other members understand who you are.
        </p>
      </header>

      <FormField label="Short bio" htmlFor="bio" helper="A sentence or two.">
        <Textarea
          id="bio"
          value={state.bio}
          onChange={(event) => update("bio", event.target.value)}
          maxLength={280}
          showCount
          rows={4}
        />
      </FormField>

      <FormField label="LinkedIn URL" htmlFor="linkedin">
        <Input
          id="linkedin"
          type="url"
          inputMode="url"
          placeholder="https://linkedin.com/in/…"
          value={state.linkedinUrl}
          onChange={(event) => update("linkedinUrl", event.target.value)}
        />
      </FormField>

      <FormField label="Website" htmlFor="website">
        <Input
          id="website"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={state.websiteUrl}
          onChange={(event) => update("websiteUrl", event.target.value)}
        />
      </FormField>
    </section>
  );
}

function isStepValid(step: number, state: State): boolean {
  switch (step) {
    case 0:
      return state.email.includes("@") && passwordMeetsMinLength(state.password);
    case 1:
      return Boolean(
        state.name && state.country && state.nationality && state.title && state.organisation,
      );
    case 2:
      return state.sectors.length > 0;
    case 3:
      return true;
    case 4:
      return state.bio.length > 0;
    default:
      return false;
  }
}
