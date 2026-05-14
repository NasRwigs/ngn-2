import Link from "next/link";
import { Handshake, Plus } from "lucide-react";

import { PairCard } from "@/components/patterns/pair-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = { title: "Mentor" };

export default async function MentorPage() {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const [pairs, requests] = await Promise.all([
    queries.pairs.forUser(user.id),
    queries.mentorship.requestsForUser(user.id),
  ]);

  const asMentee = pairs.filter((p) => p.menteeId === user.id);
  const asMentor = pairs.filter((p) => p.mentorId === user.id);
  const inbound = requests.filter(
    (r) => r.toUserId === user.id && r.status === "pending",
  );
  const outbound = requests.filter(
    (r) => r.fromUserId === user.id && r.status === "pending",
  );

  return (
    <>
      <PageHeader
        title="Mentor"
        description="Your mentorship pairs, requests, and programme progress."
        actions={
          <Button asChild>
            <Link href="/mentor/browse">
              <Plus className="size-4" aria-hidden />
              Find a mentor
            </Link>
          </Button>
        }
      />

      {(inbound.length > 0 || outbound.length > 0) && (
        <Card className="p-4 md:p-5 mb-6" accent="orange">
          <h3 className="font-medium text-on-surface">
            {inbound.length} inbound · {outbound.length} outbound requests
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Review and respond to pending mentorship requests.
          </p>
        </Card>
      )}

      <Tabs defaultValue="mentee">
        <TabsList>
          <TabsTrigger value="mentee">As mentee ({asMentee.length})</TabsTrigger>
          <TabsTrigger value="mentor">As mentor ({asMentor.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="mentee">
          {asMentee.length === 0 ? (
            <EmptyState
              icon={Handshake}
              title="No mentor yet"
              description="Browse available mentors and send your first request."
              action={
                <Button asChild>
                  <Link href="/mentor/browse">Browse mentors</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {asMentee.map((pair) => (
                <PairCard key={pair.id} pair={pair} viewerId={user.id} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mentor">
          {asMentor.length === 0 ? (
            <EmptyState
              icon={Handshake}
              title="You're not mentoring anyone yet"
              description="Update your profile to indicate you're accepting mentees."
              action={
                <Button asChild variant="secondary">
                  <Link href="/connect/edit">Update preferences</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {asMentor.map((pair) => (
                <PairCard key={pair.id} pair={pair} viewerId={user.id} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
