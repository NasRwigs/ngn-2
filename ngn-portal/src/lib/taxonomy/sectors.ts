/** Doc5 §4.1 canonical sectors. Used in onboarding step 3, profile, directory filter. */
export const SECTORS = [
  "Governance",
  "Technology",
  "Finance",
  "Health",
  "Education",
  "Energy",
  "Agriculture",
  "Media",
  "Legal",
  "Arts & Culture",
  "Other",
] as const;

export type Sector = (typeof SECTORS)[number];
