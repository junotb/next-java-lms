import { Loader2 } from "lucide-react";

type LoaderVariant = "full" | "inline";

interface LoaderProps {
  /** full: 전체 영역 중앙 정렬, inline: 버튼 내 인라인 아이콘 */
  variant?: LoaderVariant;
  className?: string;
}

/**
 * 로딩 표시 컴포넌트. Loader2 아이콘 기반으로 전체/인라인 용도 통합.
 */
export default function Loader({ variant = "full", className }: LoaderProps) {
  const icon = (
    <Loader2
      className={
        variant === "inline"
          ? "animate-spin size-4"
          : "animate-spin size-6"
      }
      aria-hidden
    />
  );

  if (variant === "inline") {
    return icon;
  }

  return (
    <div
      className="flex-1 flex items-center justify-center"
      aria-label="Loading"
      role="status"
    >
      <span className={className}>{icon}</span>
    </div>
  );
}