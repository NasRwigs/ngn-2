import {
  Calendar,
  Handshake,
  Home,
  Mail,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";

import { ADMIN_ROLES, type NavItem } from "./types";

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  {
    key: "home",
    label: "Home",
    href: "/",
    icon: Home,
    mobile: true,
    matchExact: true,
  },
  {
    key: "connect",
    label: "Connect",
    href: "/connect",
    icon: Users,
    mobile: true,
  },
  {
    key: "discuss",
    label: "Discuss",
    href: "/discuss",
    icon: MessageSquare,
    mobile: true,
  },
  {
    key: "mentor",
    label: "Mentor",
    href: "/mentor",
    icon: Handshake,
    mobile: true,
  },
  {
    key: "events",
    label: "Events",
    href: "/events",
    icon: Calendar,
    mobile: true,
  },
  {
    key: "message",
    label: "Message",
    href: "/message",
    icon: Mail,
    mobile: false,
  },
  {
    key: "admin",
    label: "Admin",
    href: "/admin",
    icon: Shield,
    mobile: false,
    roles: ADMIN_ROLES,
  },
];

export const MOBILE_NAV_ITEMS: ReadonlyArray<NavItem> = NAV_ITEMS.filter(
  (item) => item.mobile,
);

if (process.env.NODE_ENV !== "production" && MOBILE_NAV_ITEMS.length !== 5) {
  throw new Error(
    `Mobile bottom bar must have exactly 5 items (Doc2 §1.1). ` +
      `Got ${MOBILE_NAV_ITEMS.length}.`,
  );
}
