import Link from "next/link";

import { BackLink } from "@/components/ui/back-link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { dataProvider } from "@/lib/data";

export const metadata = { title: "Discussion spaces" };

export default async function DiscussionSpacesPage() {
  const { queries } = await dataProvider();
  const spaces = await queries.spaces.list();

  return (
    <>
      <BackLink href="/discuss" className="mt-4">
        Back to discuss
      </BackLink>
      <PageHeader
        title="Discussion spaces"
        description="Threaded conversations organised by topic."
      />
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <li key={space.id}>
            <Card className="p-5 h-full">
              <Link
                href={`/discuss/spaces/${space.slug}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                <h3 className="font-medium text-on-surface">{space.name}</h3>
                <p className="mt-1 text-sm text-on-surface-variant line-clamp-2">
                  {space.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {space.programmeArea && <Tag size="sm">{space.programmeArea}</Tag>}
                  <Tag size="sm">{space.memberCount} members</Tag>
                </div>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
