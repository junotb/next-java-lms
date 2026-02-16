import { cn } from "@/lib/utils";

interface SpinnerProps {
  /** sm: 버튼 내부용, md: 폼 로딩용 */
  size?: "sm" | "md";
  className?: string;
}

/**
 * 폼 제출·버튼 로딩 시 사용하는 CSS 기반 스피너.
 * Loader(Loader2 아이콘)와 달리 border 애니메이션으로 더 가벼운 시각.
 */
export default function Spinner({
  size = "sm",
  className,
}: SpinnerProps) {
  const sizeClass = size === "sm" ? "size-4" : "size-6";

  return (
    <span
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClass,
        className
      )}
      aria-hidden
    />
  );
}
