import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SettingsLayoutContent from "@/components/settings/SettingsLayoutContent";

export default async function TeachSettingsLayout({
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
      dashboardPath="/teach"
      settingsBasePath="/teach/settings"
    >
      {children}
    </SettingsLayoutContent>
  );
}
