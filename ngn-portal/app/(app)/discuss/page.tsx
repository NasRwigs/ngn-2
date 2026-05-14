import Link from "next/link";
import { ArrowRight, MessageSquare, Users } from "lucide-react";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";

export const metadata = { title: "Discuss" };

export default async function DiscussPage() {
  const { queries } = await dataProvider();
  const [spaces, circles] = await Promise.all([
    queries.spaces.list(),
    queries.circles.list(),
  ]);

  return (
    <>
      <PageHeader
        title="Discuss"
        description="Threads, circles, and one-to-many sessions. Where the network thinks together."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-5 md:p-6" accent="blue">
          <header className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" aria-hidden />
              <CardTitle>Discussion spaces</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/discuss/spaces">
                All <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </header>
          <ul className="space-y-2">
            {spaces.slice(0, 4).map((space) => (
              <li key={space.id}>
                <Link
                  href={`/discuss/spaces/${space.slug}`}
                  className="flex items-start justify-between gap-2 p-2 rounded hover:bg-surface-container"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-on-surface truncate">
                      {space.name}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {space.description}
                    </p>
                  </div>
                  <span className="text-xs text-on-surface-variant shrink-0">
                    {space.memberCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 md:p-6" accent="orange">
          <header className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-secondary-container" aria-hidden />
              <CardTitle>Circles</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/discuss/circles">
                All <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </header>
          <ul className="space-y-2">
            {circles.slice(0, 4).map((circle) => (
              <li key={circle.id}>
                <Link
                  href={`/discuss/circles/${circle.slug}`}
                  className="flex items-start justify-between gap-2 p-2 rounded hover:bg-surface-container"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-on-surface truncate">
                      {circle.name}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {circle.topic}
                    </p>
                  </div>
                  <span className="text-xs text-on-surface-variant shrink-0 capitalize">
                    {circle.cadence}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="mt-8">
        <header className="flex items-center justify-between mb-3">
          <CardTitle>One-to-many sessions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/discuss/sessions">
              All <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </header>
        <p className="text-body-md text-on-surface-variant">
          AMAs, masterclasses, and host-led sessions. Limited capacity.
        </p>
      </section>
    </>
  );
}
