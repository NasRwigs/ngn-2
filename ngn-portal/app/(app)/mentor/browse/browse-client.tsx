"use client";

import * as React from "react";
import Link from "next/link";

import { Avatar } from "@/components/app-shell/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterBar } from "@/components/patterns/filter-bar";
import { SearchInput } from "@/components/ui/search-input";
import { Tag } from "@/components/ui/tag";
import { SECTORS } from "@/lib/taxonomy/sectors";
import type { Member } from "@/lib/data/types";

const FILTERS = [
  {
    key: "sector",
    label: "Sector",
    options: SECTORS.slice(0, 6).map((s) => ({ value: s, label: s })),
  },
  {
    key: "cadence",
    label: "Cadence",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "biweekly", label: "Bi-weekly" },
      { value: "monthly", label: "Monthly" },
    ],
  },
];

export function BrowseMentorsClient({ members }: { members: Member[] }) {
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string | undefined>>({});

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return members.filter((member) => {
      if (filters.sector && !member.sectors.includes(filters.sector))
        return false;
      if (filters.cadence && member.availability !== filters.cadence)
        return false;
      if (q) {
        const haystack = `${member.name} ${member.title} ${member.expertise.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [members, query, filters]);

  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <SearchInput
          placeholder="Search expertise, role, or name…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
          aria-label="Search mentors"
        />
      </div>

      <FilterBar
        filters={FILTERS}
        value={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <p className="text-body-md text-on-surface-variant py-12 text-center">
          No mentors match your filters.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((member) => (
            <li key={member.id}>
              <Card className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar src={member.avatarUrl} name={member.name} size={56} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/connect/${member.slug}`}
                      className="font-medium text-on-surface hover:underline truncate block"
                    >
                      {member.name}
                    </Link>
                    <p className="text-sm text-on-surface-variant truncate">
                      {member.title} · {member.organisation}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {member.expertise.slice(0, 3).map((tag) => (
                        <Tag key={tag} size="sm">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button asChild size="sm">
                        <Link href={`/mentor/request?to=${member.id}`}>
                          Request mentorship
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/connect/${member.slug}`}>View profile</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
