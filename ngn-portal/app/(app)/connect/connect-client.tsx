"use client";

import * as React from "react";

import { FilterBar } from "@/components/patterns/filter-bar";
import { ProfileCard } from "@/components/patterns/profile-card";
import { SearchInput } from "@/components/ui/search-input";
import { SECTORS } from "@/lib/taxonomy/sectors";
import type { Member } from "@/lib/data/types";

const FILTERS = [
  {
    key: "sector",
    label: "Sector",
    options: SECTORS.slice(0, 6).map((s) => ({ value: s, label: s })),
  },
  {
    key: "country",
    label: "Country",
    options: ["Nigeria", "Ghana", "Kenya", "Senegal", "South Africa"].map(
      (c) => ({ value: c, label: c }),
    ),
  },
  {
    key: "mentorship",
    label: "Mentorship",
    options: [
      { value: "accepting_mentees", label: "Accepting mentees" },
      { value: "looking_for_mentor", label: "Seeking mentor" },
      { value: "both", label: "Both" },
    ],
  },
];

export function ConnectClient({ members }: { members: Member[] }) {
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string | undefined>>({});

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    return members.filter((member) => {
      if (filters.sector && !member.sectors.includes(filters.sector))
        return false;
      if (filters.country && member.country !== filters.country) return false;
      if (filters.mentorship && member.mentorshipStatus !== filters.mentorship)
        return false;
      if (q) {
        const haystack = `${member.name} ${member.title} ${member.organisation} ${member.expertise.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [members, query, filters]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search name, organisation, or expertise…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            aria-label="Search members"
          />
        </div>
      </div>

      <FilterBar
        filters={FILTERS}
        value={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <p className="text-body-md text-on-surface-variant py-12 text-center">
          No members match your filters.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((member) => (
            <li key={member.id}>
              <ProfileCard member={member} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
