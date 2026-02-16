import Link from "next/link";
import SettingsNav from "./SettingsNav";

interface SettingsLayoutContentProps {
  dashboardPath: string;
  settingsBasePath: string;
  children: React.ReactNode;
}

/**
 * 설정 영역 공통 레이아웃. 대시보드 링크, SettingsNav, children.
 * Better Auth: Layout 단 세션 검증은 호출 측(layout)에서 auth.api.getSession 수행.
 */
export default function SettingsLayoutContent({
  dashboardPath,
  settingsBasePath,
  children,
}: SettingsLayoutContentProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            href={dashboardPath}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← 대시보드로
          </Link>
          <span className="ml-4 font-semibold">계정 설정</span>
        </div>
      </header>
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <SettingsNav basePath={settingsBasePath} />
        {children}
      </div>
    </div>
  );
}
