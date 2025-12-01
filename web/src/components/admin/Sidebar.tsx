export default function AdminSidebar() {
  return (
    <nav className="w-64 bg-background border-r min-h-screen p-4">
      <ul className="space-y-4">
        <li>
          <a href="/admin" className="text-lg font-semibold text-foreground hover:text-primary">
            대시보드
          </a>
        </li>
        <li>
          <a href="/admin/users" className="text-lg font-semibold text-foreground hover:text-primary">
            사용자 관리
          </a>
        </li>
        <li>
          <a href="/admin/courses" className="text-lg font-semibold text-foreground hover:text-primary">
            강의 관리
          </a>
        </li>
        <li>
          <a href="/admin/feedback" className="text-lg font-semibold text-foreground hover:text-primary">
            피드백 관리
          </a>
        </li>
      </ul>
    </nav>
  );
}