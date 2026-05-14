import Link from "next/link";
import { Activity, AlertTriangle, Calendar, Users } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { PairStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";

export const metadata = { title: "Admin overview" };

export default async function AdminOverviewPage() {
  const { queries } = await dataProvider();
  const [stats, pairsAttn, unmatched] = await Promise.all([
    queries.admin.overviewStats(),
    queries.admin.pairsRequiringAttention(),
    queries.admin.unmatchedMentees(),
  ]);

  return (
    <>
      <PageHeader
        title="Admin overview"
        description="Programme health at a glance. Drill into each section for management actions."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trendPct={stat.trendPct}
            tone={stat.tone}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2 mt-8">
        <Card className="p-5 md:p-6" accent="orange">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-warning" aria-hidden />
              <CardTitle>Requires attention</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/mentorship">View all</Link>
            </Button>
          </header>
          {pairsAttn.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              No pairs need attention right now.
            </p>
          ) : (
            <ul className="space-y-2">
              {pairsAttn.slice(0, 5).map((pair) => {
                const mentee = findMember(pair.menteeId);
                const mentor = findMember(pair.mentorId);
                return (
                  <li
                    key={pair.id}
                    className="flex items-center justify-between gap-3 p-2 rounded hover:bg-surface-container"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar
                        src={mentee?.avatarUrl}
                        name={mentee?.name ?? "?"}
                        size={32}
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/admin/mentorship/${pair.id}`}
                          className="text-sm font-medium text-on-surface hover:underline truncate block"
                        >
                          {mentee?.name} × {mentor?.name}
                        </Link>
                        <p className="text-xs text-on-surface-variant">
                          {pair.cohort}
                        </p>
                      </div>
                    </div>
                    <PairStatusBadge status={pair.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-5 md:p-6" accent="blue">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-primary" aria-hidden />
              <CardTitle>Unmatched mentees</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/mentorship/matching">Open matching workspace</Link>
            </Button>
          </header>
          {unmatched.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              All mentees are matched.
            </p>
          ) : (
            <ul className="space-y-2">
              {unmatched.slice(0, 5).map((mentee) => (
                <li
                  key={mentee.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-surface-container"
                >
                  <Avatar
                    src={mentee.avatarUrl}
                    name={mentee.name}
                    size={32}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {mentee.name}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {mentee.sectors.join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-3 mt-8">
        <Card className="p-5">
          <Activity className="size-5 text-primary mb-2" aria-hidden />
          <h3 className="font-medium text-on-surface">Programme activity</h3>
          <p className="text-sm text-on-surface-variant">
            Sessions logged, events attended, and engagement trends.
          </p>
          <Button asChild variant="ghost" size="sm" className="mt-2">
            <Link href="/admin/mentorship">View report</Link>
          </Button>
        </Card>
        <Card className="p-5">
          <Calendar className="size-5 text-primary mb-2" aria-hidden />
          <h3 className="font-medium text-on-surface">Upcoming events</h3>
          <p className="text-sm text-on-surface-variant">
            Review and manage scheduled programming.
          </p>
          <Button asChild variant="ghost" size="sm" className="mt-2">
            <Link href="/admin/events">Manage</Link>
          </Button>
        </Card>
        <Card className="p-5">
          <Users className="size-5 text-primary mb-2" aria-hidden />
          <h3 className="font-medium text-on-surface">Member growth</h3>
          <p className="text-sm text-on-surface-variant">
            Onboarding pipeline and recent joiners.
          </p>
          <Button asChild variant="ghost" size="sm" className="mt-2">
            <Link href="/admin/members">Manage members</Link>
          </Button>
        </Card>
      </section>
    </>
  );
}
