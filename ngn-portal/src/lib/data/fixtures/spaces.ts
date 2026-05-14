import type { DiscussionSpace } from "../types";

export const DISCUSSION_SPACES: DiscussionSpace[] = [
  {
    id: "ds_general",
    slug: "general",
    name: "General",
    description: "Open discussion for all members.",
    memberCount: 342,
  },
  {
    id: "ds_announcements",
    slug: "announcements",
    name: "Announcements",
    description: "Official announcements from ExCo and Programme Admins.",
    memberCount: 342,
  },
  {
    id: "ds_mentorship",
    slug: "mentorship",
    name: "Mentorship",
    description: "Discussion space for the mentorship programme.",
    memberCount: 180,
    programmeArea: "Mentorship",
  },
  {
    id: "ds_climate",
    slug: "climate",
    name: "Climate & Energy",
    description: "Climate adaptation and energy transition discussions.",
    memberCount: 64,
    programmeArea: "Future of Africa",
  },
];
