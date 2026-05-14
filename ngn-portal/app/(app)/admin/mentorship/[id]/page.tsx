import { redirect } from "next/navigation";

/**
 * Admin pair detail simply re-uses the member-side pair detail view —
 * the data shown is the same, just with admin context. The /admin/mentorship/[id]
 * route is preserved so admin URLs are stable.
 */
export default async function AdminPairDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/mentor/pairs/${id}`);
}
