import TeachHeader from "@/components/teach/TeachHeader";

export default function TeachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TeachHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
