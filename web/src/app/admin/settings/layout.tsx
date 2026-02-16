import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SettingsLayoutContent from "@/components/settings/SettingsLayoutContent";

export default async function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <SettingsLayoutContent
      dashboardPath="/admin"
      settingsBasePath="/admin/settings"
    >
      {children}
    </SettingsLayoutContent>
  );
}
