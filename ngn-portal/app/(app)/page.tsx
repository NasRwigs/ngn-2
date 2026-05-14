import Link from "next/link";
import { ArrowRight, Calendar, Handshake, Users } from "lucide-react";

import { EventCard } from "@/components/patterns/event-card";
import { PairCard } from "@/components/patterns/pair-card";
import { ProfileCard } from "@/components/patterns/profile-card";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ROLE_LABELS } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { dataProvider } from "@/lib/data";
import { greeting } from "@/lib/format/date";

export const metadata = { title: "Home" };

export default async function HomePage() {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const [pairs, upcomingEvents, suggested, notifications] = await Promise.all([
    queries.pairs.forUser(user.id),
    queries.events.list({ upcomingOnly: true }),
    queries.members.suggestedMentors(user.id),
    queries.notifications.list(user.id),
  ]);

  const activePairs = pairs.filter((p) => p.status === "Active");
  const upcomingEvent = upcomingEvents[0];

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${user.firstName}`}
        description={`You're signed in as a ${ROLE_LABELS[user.role]}.`}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5" accent="blue">
          <Handshake className="size-6 text-primary" aria-hidden />
          <div className="mt-2 text-headline-md text-on-surface font-bold">
            {activePairs.length}
          </div>
          <div className="text-sm text-on-surface-variant">Active pairs</div>
        </Card>
        <Card className="p-5" accent="orange">
          <Calendar className="size-6 text-secondary-container" aria-hidden />
          <div className="mt-2 text-headline-md text-on-surface font-bold">
            {upcomingEvents.length}
          </div>
          <div className="text-sm text-on-surface-variant">
            Upcoming events
          </div>
        </Card>
        <Card className="p-5" accent="lime">
          <Users className="size-6 text-tertiary" aria-hidden />
          <div className="mt-2 text-headline-md text-on-surface font-bold">
            {notifications.filter((n) => !n.readAt).length}
          </div>
          <div className="text-sm text-on-surface-variant">
            Unread notifications
          </div>
        </Card>
      </section>

      <section className="mt-8">
        <header className="flex items-center justify-between mb-3">
          <CardTitle>Your mentorship</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/mentor">
              View all <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </header>

        {activePairs.length === 0 ? (
          <EmptyState
            icon={Handshake}
            title="No active pairs yet"
            description="Find a mentor or accept an invitation to get started with the programme."
            action={
              <Button asChild>
                <Link href="/mentor/browse">Browse mentors</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {activePairs.slice(0, 2).map((pair) => (
              <PairCard key={pair.id} pair={pair} viewerId={user.id} />
            ))}
          </div>
        )}
      </section>

      {upcomingEvent && (
        <section className="mt-8">
          <header className="flex items-center justify-between mb-3">
            <CardTitle>Upcoming events</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/events">
                View all <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <header className="flex items-center justify-between mb-3">
          <CardTitle>People you may want to connect with</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/connect">
              View directory <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {suggested.map((member) => (
            <ProfileCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </>
  );
}
