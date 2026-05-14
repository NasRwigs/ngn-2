/** Doc1 §1.2 + Doc5 §4.2 canonical programme areas. */
export const PROGRAMME_AREAS = [
  "Mentorship",
  "In Conversation",
  "Debates",
  "Future of Africa",
  "Insights",
  "Advisory",
  "General / Cross-cutting",
] as const;

export type ProgrammeArea = (typeof PROGRAMME_AREAS)[number];

export const PROGRAMME_AREA_COLORS: Record<ProgrammeArea, string> = {
  Mentorship: "primary",
  "In Conversation": "tertiary",
  Debates: "secondary",
  "Future of Africa": "primary-container",
  Insights: "warning",
  Advisory: "success",
  "General / Cross-cutting": "outline",
};
