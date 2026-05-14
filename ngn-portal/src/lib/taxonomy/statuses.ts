/** Doc5 §4.5 pair-status vocabulary. */
export const PAIR_STATUSES = ["Active", "Pending", "At Risk", "Completed"] as const;
export type PairStatus = (typeof PAIR_STATUSES)[number];

export const PAIR_STATUS_TONE: Record<PairStatus, "success" | "warning" | "error" | "info"> = {
  Active: "success",
  Pending: "warning",
  "At Risk": "error",
  Completed: "info",
};

/** Doc5 §4.4 event format. */
export const EVENT_FORMATS = ["Virtual", "In-person", "Hybrid"] as const;
export type EventFormat = (typeof EVENT_FORMATS)[number];

export const EVENT_TYPES = [
  "Webinar",
  "Workshop",
  "Panel",
  "Forum",
  "Mixer",
  "Summit",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** Mentorship request status. */
export const REQUEST_STATUSES = ["pending", "accepted", "declined", "cancelled"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];
