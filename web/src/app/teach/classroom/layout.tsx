/**
 * classroom은 전체 화면·최소 UI. fixed로 헤더를 덮어 독립된 수업 공간 제공.
 */
export default function TeachClassroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 overflow-hidden">
      {children}
    </div>
  );
}
