import { notFound } from "next/navigation";
import { Calendar, Globe, MapPin, Users } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { Badge } from "@/components/ui/badge";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { DataList } from "@/components/ui/data-list";
import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";
import { formatDateTime } from "@/lib/format/date";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { queries } = await dataProvider();
  const event = await queries.events.bySlug(slug);
  return { title: event?.title ?? "Event not found" };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { queries } = await dataProvider();
  const event = await queries.events.bySlug(slug);
  if (!event) notFound();

  const upcoming = new Date(event.startAt).getTime() >= Date.now();
  const seatsLeft = event.capacity
    ? event.capacity - event.registeredCount
    : null;

  return (
    <>
      <BackLink href="/events" className="mt-4">
        Back to events
      </BackLink>

      <PageHeader
        title={event.title}
        description={event.description}
        meta={
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="info">{event.programmeArea}</Badge>
            <Badge tone="brand">{event.type}</Badge>
            <Badge tone="neutral">{event.format}</Badge>
          </div>
        }
        actions={
          upcoming ? (
            event.registered ? (
              <Button variant="outline">Cancel registration</Button>
            ) : event.registrationRequired ? (
              <Button>Register</Button>
            ) : (
              <Button>Add to calendar</Button>
            )
          ) : event.recordingUrl ? (
            <Button asChild>
              <a href={event.recordingUrl} target="_blank" rel="noreferrer">
                Watch recording
              </a>
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 md:p-6 lg:col-span-1 h-fit">
          <DataList
            items={[
              { label: "When", value: (
                <span className="inline-flex items-center gap-1"><Calendar className="size-4" aria-hidden />{formatDateTime(event.startAt)}</span>
              ) },
              { label: "Where", value: event.format === "Virtual" ? (
                <span className="inline-flex items-center gap-1"><Globe className="size-4" aria-hidden />Virtual</span>
              ) : (
                <span className="inline-flex items-center gap-1"><MapPin className="size-4" aria-hidden />{event.location ?? "TBA"}</span>
              ) },
              ...(event.registrationRequired ? [{
                label: "Capacity",
                value: (
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-4" aria-hidden />
                    {event.registeredCount}/{event.capacity ?? "—"}
                    {seatsLeft !== null && seatsLeft > 0 && (
                      <span className="text-xs text-on-surface-variant">
                        · {seatsLeft} left
                      </span>
                    )}
                  </span>
                ),
              }] : []),
            ]}
          />
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 md:p-6">
            <CardTitle>About</CardTitle>
            <p className="mt-3 text-body-md text-on-surface whitespace-pre-line">
              {event.description}
            </p>
            {event.recap && (
              <>
                <h3 className="mt-4 font-medium text-on-surface">Recap</h3>
                <p className="mt-1 text-body-md text-on-surface-variant whitespace-pre-line">
                  {event.recap}
                </p>
              </>
            )}
          </Card>

          {event.speakers.length > 0 && (
            <Card className="p-5 md:p-6">
              <CardTitle>Speakers</CardTitle>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {event.speakers.map((speaker) => (
                  <li
                    key={speaker.id}
                    className="flex items-center gap-3"
                  >
                    <Avatar
                      src={speaker.avatarUrl}
                      name={speaker.name}
                      size={40}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-on-surface truncate">
                        {speaker.name}
                      </p>
                      <p className="text-sm text-on-surface-variant truncate">
                        {speaker.role}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {event.materials && event.materials.length > 0 && (
            <Card className="p-5 md:p-6">
              <CardTitle>Materials</CardTitle>
              <ul className="mt-3 space-y-1.5">
                {event.materials.map((mat) => (
                  <li key={mat.id}>
                    <a
                      href={mat.url}
                      className="text-primary hover:underline text-sm"
                    >
                      {mat.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
