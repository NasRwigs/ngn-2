import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";

import { EditProfileForm } from "./edit-form";

export const metadata = { title: "Edit profile" };

export default async function EditProfilePage() {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const member = await queries.members.byId(user.id);
  if (!member) return null;

  return (
    <>
      <BackLink href={`/connect/${member.slug}`} className="mt-4">
        Back to profile
      </BackLink>
      <PageHeader
        title="Edit profile"
        description="Update your information so other members can find and connect with you."
      />
      <EditProfileForm member={member} />
    </>
  );
}
