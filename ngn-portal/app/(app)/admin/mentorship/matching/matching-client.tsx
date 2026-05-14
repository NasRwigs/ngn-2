"use client";

import * as React from "react";

import { Avatar } from "@/components/app-shell/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { toast } from "@/components/ui/toaster";
import type { Member } from "@/lib/data/types";

interface MatchingClientProps {
  mentees: Member[];
  mentors: Member[];
}

export function MatchingClient({ mentees, mentors }: MatchingClientProps) {
  const [selectedMentee, setSelectedMentee] = React.useState<Member | null>(
    mentees[0] ?? null,
  );

  React.useEffect(() => {
    if (!selectedMentee && mentees[0]) setSelectedMentee(mentees[0]);
  }, [mentees, selectedMentee]);

  const ranked = React.useMemo(() => {
    if (!selectedMentee) return [] as Array<{ mentor: Member; score: number; reasons: string[] }>;
    return mentors
      .map((mentor) => {
        const reasons: string[] = [];
        let score = 0;
        const sharedSectors = mentor.sectors.filter((s) =>
          selectedMentee.sectors.includes(s),
        );
        if (sharedSectors.length > 0) {
          score += sharedSectors.length * 30;
          reasons.push(`Shared sectors: ${sharedSectors.join(", ")}`);
        }
        const sharedExpertise = mentor.expertise.filter((e) =>
          selectedMentee.expertise.some((me) =>
            me.toLowerCase().includes(e.toLowerCase()),
          ),
        );
        if (sharedExpertise.length > 0) {
          score += sharedExpertise.length * 20;
          reasons.push(`Expertise overlap: ${sharedExpertise.join(", ")}`);
        }
        if (mentor.country === selectedMentee.country) {
          score += 10;
          reasons.push(`Same country: ${mentor.country}`);
        }
        if (
          mentor.availability &&
          selectedMentee.availability &&
          mentor.availability === selectedMentee.availability
        ) {
          score += 15;
          reasons.push(`Cadence match: ${mentor.availability}`);
        }
        return { mentor, score, reasons };
      })
      .sort((a, b) => b.score - a.score);
  }, [selectedMentee, mentors]);

  function propose(mentor: Member) {
    if (!selectedMentee) return;
    toast.success(
      `Proposed pair: ${selectedMentee.name} × ${mentor.name}`,
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="p-4">
        <h3 className="font-medium text-on-surface mb-3">
          Unmatched mentees ({mentees.length})
        </h3>
        {mentees.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No unmatched mentees right now.
          </p>
        ) : (
          <ul className="space-y-1">
            {mentees.map((mentee) => (
              <li key={mentee.id}>
                <button
                  type="button"
                  onClick={() => setSelectedMentee(mentee)}
                  className={`w-full flex items-center gap-3 p-2 rounded text-left ${
                    selectedMentee?.id === mentee.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-surface-container"
                  }`}
                >
                  <Avatar
                    src={mentee.avatarUrl}
                    name={mentee.name}
                    size={32}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium truncate">
                      {mentee.name}
                    </span>
                    <span className="block text-xs text-on-surface-variant truncate">
                      {mentee.sectors.join(", ")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5 md:p-6">
        {selectedMentee ? (
          <>
            <header className="mb-4">
              <h3 className="font-medium text-on-surface">
                Suggested mentors for {selectedMentee.name}
              </h3>
              <p className="text-sm text-on-surface-variant">
                Ranked by sector, expertise, cadence, and geographical match.
              </p>
            </header>

            <ul className="space-y-3">
              {ranked.map(({ mentor, score, reasons }) => (
                <li
                  key={mentor.id}
                  className="rounded-lg border border-outline-variant p-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={mentor.avatarUrl}
                      name={mentor.name}
                      size={48}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-on-surface">
                            {mentor.name}
                          </h4>
                          <p className="text-sm text-on-surface-variant">
                            {mentor.title} · {mentor.organisation}
                          </p>
                        </div>
                        <Badge tone={score > 50 ? "success" : score > 0 ? "info" : "neutral"}>
                          {score} pts
                        </Badge>
                      </div>
                      {reasons.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {reasons.map((r) => (
                            <li key={r}>
                              <Tag size="sm">{r}</Tag>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-3">
                        <Button size="sm" onClick={() => propose(mentor)}>
                          Propose pair
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-body-md text-on-surface-variant">
            Select an unmatched mentee to see ranked mentor recommendations.
          </p>
        )}
      </Card>
    </div>
  );
}
