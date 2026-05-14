import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { can } from "@/lib/auth/permissions";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";

import { EventsClient } from "./events-client";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const upcoming = await queries.events.list({ upcomingOnly: true });

  return (
    <>
      <PageHeader
        title="Events"
        description="Future of Africa, In Conversation, Debates, Insights, and more."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/events/archive">View archive</Link>
            </Button>
            {can(user, "create_event") && (
              <Button asChild>
                <Link href="/events/new">
                  <Plus className="size-4" aria-hidden />
                  Create event
                </Link>
              </Button>
            )}
          </div>
        }
      />

      {upcoming.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No upcoming events"
          description="Check back soon, or browse the archive."
          action={
            <Button asChild variant="secondary">
              <Link href="/events/archive">Browse archive</Link>
            </Button>
          }
        />
      ) : (
        <EventsClient events={upcoming} />
      )}
    </>
  );
}
