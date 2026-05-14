import type { NotificationItem } from "../types";

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    userId: "m_sarah",
    kind: "mentorship",
    title: "Next session reminder",
    body: "Your session with David Osei is in 12 days.",
    href: "/mentor/pairs/p_sarah_david",
    createdAt: "2026-05-12T08:00:00Z",
    readAt: null,
  },
  {
    id: "n2",
    userId: "m_sarah",
    kind: "event",
    title: "New event registered",
    body: "You're registered for the Mentorship Cohort '26 Mixer.",
    href: "/events/mentorship-mixer",
    createdAt: "2026-05-11T14:20:00Z",
    readAt: null,
  },
];
