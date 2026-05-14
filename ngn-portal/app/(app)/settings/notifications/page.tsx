import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";

import { NotificationsForm } from "./notifications-form";

export const metadata = { title: "Notification preferences" };

export default function NotificationsPrefsPage() {
  return (
    <>
      <BackLink href="/settings" className="mt-4">
        Back to settings
      </BackLink>
      <PageHeader
        title="Notification preferences"
        description="Choose what you want to be notified about and how."
      />
      <NotificationsForm />
    </>
  );
}
