export default function ClassroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">{children}</div>;
}
