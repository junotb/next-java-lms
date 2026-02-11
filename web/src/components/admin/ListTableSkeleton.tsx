import { Skeleton } from "@/components/ui/skeleton";

interface ListTableSkeletonProps {
  /** 테이블 컬럼 수 (헤더 + 액션 포함) */
  columnCount?: number;
  /** 스켈레톤 행 수 */
  rowCount?: number;
}

/**
 * 관리자 리스트 페이지 테이블 스켈레톤. 레이아웃 시프트를 줄입니다.
 */
export default function ListTableSkeleton({
  columnCount = 5,
  rowCount = 8,
}: ListTableSkeletonProps) {
  return (
    <table className="min-w-full divide-y divide-border">
      <thead className="bg-muted">
        <tr>
          {Array.from({ length: columnCount }).map((_, i) => (
            <th
              key={i}
              scope="col"
              className="px-6 py-4 text-left"
            >
              <Skeleton className="h-4 w-16" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {Array.from({ length: rowCount }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {Array.from({ length: columnCount }).map((_, colIdx) => (
              <td key={colIdx} className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
