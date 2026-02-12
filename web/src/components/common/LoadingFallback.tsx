import Loader from "@/components/common/Loader";

type LoadingVariant = "default" | "admin" | "feedback" | "classroom";

const VARIANT_CLASSES: Record<LoadingVariant, string> = {
  default:
    "container mx-auto py-12 px-4 max-w-4xl min-h-[50vh] flex items-center justify-center",
  admin:
    "container mx-auto py-12 px-4 max-w-7xl min-h-[50vh] flex items-center justify-center",
  feedback:
    "container max-w-4xl py-12 min-h-[50vh] flex items-center justify-center",
  classroom: "flex-1 flex items-center justify-center bg-zinc-950 min-h-[60vh]",
};

interface LoadingFallbackProps {
  variant?: LoadingVariant;
}

/**
 * Suspense fallback용 공통 로딩 영역.
 * 페이지별 loading.tsx에서 재사용.
 */
export default function LoadingFallback({
  variant = "default",
}: LoadingFallbackProps) {
  return (
    <div className={VARIANT_CLASSES[variant]}>
      <Loader />
    </div>
  );
}
