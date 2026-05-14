import type { ModerationReport } from "../types";

export const MODERATION_REPORTS: ModerationReport[] = [
  {
    id: "r1",
    kind: "comment",
    reportedBy: "Member",
    reason: "Off-topic",
    body: "This thread is going off topic — can we keep this focused on the climate adaptation framework?",
    spaceName: "Climate & Energy",
    reportedAt: "2026-05-12T08:00:00Z",
  },
  {
    id: "r2",
    kind: "post",
    reportedBy: "Member",
    reason: "Possible spam",
    body: "Check out this third-party platform that does X, Y, Z…",
    spaceName: "General",
    reportedAt: "2026-05-11T19:00:00Z",
  },
];
