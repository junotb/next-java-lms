import StudyHeader from "@/components/study/StudyHeader";

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <StudyHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
