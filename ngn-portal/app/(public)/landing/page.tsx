import Link from "next/link";
import { ArrowRight, Users, Handshake, Calendar, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "The home for Africa's next generation of leaders",
  description:
    "The NGN Portal connects members across mentorship, events, debates, and Future of Africa programmes.",
};

const PILLARS = [
  {
    icon: Users,
    title: "Connect",
    body: "Browse and connect with members across sectors, countries, and disciplines.",
  },
  {
    icon: Handshake,
    title: "Mentorship",
    body: "Request, run, and reflect on structured 6-month mentorship engagements.",
  },
  {
    icon: Calendar,
    title: "Events",
    body: "Discover Future of Africa, In Conversation, Debates, and Insights programmes.",
  },
  {
    icon: MessageSquare,
    title: "Discuss",
    body: "Join discussion spaces, circles, and one-to-many sessions.",
  },
];

export default function LandingPage() {
  return (
    <main>
      <header className="container-content px-4 md:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-on-surface">
          <div className="size-8 rounded bg-primary text-on-primary grid place-items-center font-bold">
            N
          </div>
          NGN Portal
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/onboarding">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="container-content px-4 md:px-8 py-12 md:py-24 bg-afro-pattern">
        <div className="max-w-3xl">
          <p className="text-label-sm uppercase tracking-wide text-secondary font-medium">
            Mo Ibrahim Foundation
          </p>
          <h1 className="mt-2 text-headline-lg-mobile md:text-display-lg font-bold text-on-surface">
            The home for Africa&apos;s next generation of leaders.
          </h1>
          <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
            Connect, mentor, debate, and shape the future of governance across the
            continent. NGN brings together emerging leaders for structured
            programmes and ongoing dialogue.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Get started <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-content px-4 md:px-8 py-12 md:py-20">
        <h2 className="text-headline-md text-on-surface">What you can do</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="p-5" accent="blue">
                <div className="size-10 rounded-full bg-primary/10 grid place-items-center mb-3">
                  <Icon className="size-5 text-primary" aria-hidden />
                </div>
                <h3 className="font-bold text-on-surface">{pillar.title}</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {pillar.body}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="container-content px-4 md:px-8 py-8 border-t border-outline-variant">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-sm text-on-surface-variant">
          <p>© Mo Ibrahim Foundation. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal" className="hover:underline">
              Legal
            </Link>
            <Link href="/legal#privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/legal#terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
