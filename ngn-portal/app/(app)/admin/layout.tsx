import { redirect } from "next/navigation";
import Link from "next/link";

import { ADMIN_ROLES } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/session";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", matchExact: true },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/mentorship", label: "Mentorship" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/spaces", label: "Spaces" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!ADMIN_ROLES.includes(user.role)) {
    redirect("/");
  }

  return (
    <>
      <nav
        aria-label="Admin sections"
        className="flex gap-1 overflow-x-auto border-b border-outline-variant -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-16 lg:px-16 mt-2"
      >
        {ADMIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface whitespace-nowrap border-b-2 border-transparent hover:border-outline-variant"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </>
  );
}
