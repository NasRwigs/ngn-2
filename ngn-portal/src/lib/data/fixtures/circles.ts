import type { Circle, OneToManySession } from "../types";

export const CIRCLES: Circle[] = [
  {
    id: "c_tech_leadership",
    slug: "tech-leadership",
    name: "Tech Leadership Circle",
    topic: "Scaling engineering organisations across Africa",
    cadence: "monthly",
    capacity: 12,
    facilitators: ["m_david"],
    memberIds: ["m_sarah", "m_kwame", "m_david"],
    description:
      "Monthly conversations on engineering leadership, hiring, and culture. Open to senior+ engineers and PMs.",
    createdAt: "2026-02-01",
  },
  {
    id: "c_women_in_finance",
    slug: "women-in-finance",
    name: "Women in Finance",
    topic: "Career trajectories in African capital markets",
    cadence: "biweekly",
    capacity: 10,
    facilitators: ["m_fatou"],
    memberIds: ["m_fatou", "m_aisha"],
    description:
      "Peer support and structured discussions for women building careers in finance.",
    createdAt: "2026-03-15",
  },
  {
    id: "c_climate",
    slug: "climate-adaptation",
    name: "Climate Adaptation Forum",
    topic: "Adaptation strategies for African communities",
    cadence: "monthly",
    capacity: 20,
    facilitators: ["m_amina", "m_yusuf"],
    memberIds: ["m_amina", "m_yusuf"],
    description: "Cross-sector climate adaptation working group.",
    createdAt: "2026-01-10",
  },
];

export const ONE_TO_MANY_SESSIONS: OneToManySession[] = [
  {
    id: "s_career_transitions",
    title: "Career transitions in tech",
    description:
      "David Osei hosts an AMA on senior-to-staff and staff-to-leadership career transitions.",
    hostId: "m_david",
    programmeArea: "Mentorship",
    startAt: "2026-05-30T15:00:00Z",
    endAt: "2026-05-30T16:00:00Z",
    format: "Virtual",
    capacity: 50,
    registeredCount: 31,
  },
  {
    id: "s_impact_investing",
    title: "Impact investing 101",
    description:
      "Fatou Ndiaye introduces frameworks for evaluating impact investments.",
    hostId: "m_fatou",
    programmeArea: "Advisory",
    startAt: "2026-06-08T14:00:00Z",
    endAt: "2026-06-08T15:30:00Z",
    format: "Virtual",
    capacity: 30,
    registeredCount: 18,
  },
];
