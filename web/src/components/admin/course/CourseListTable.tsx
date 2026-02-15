import { Course } from "@/schemas/course/course";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { COURSE_STATUS_LABELS, COURSE_STATUS_COLORS } from "@/constants/course";

interface CourseListTableProps {
  courses: Course[];
  onUpdate: (courseId: number) => void;
  onDelete: (courseId: number) => void;
}

export default function CourseListTable({
  courses,
  onUpdate,
  onDelete,
}: CourseListTableProps) {
  return (
    <table className="w-full min-w-[28rem] divide-y divide-border table-auto">
      <thead className="bg-muted">
        <tr>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            제목
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            상태
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            생성일
          </th>
          <th scope="col" className="relative px-3 py-3 sm:px-6 sm:py-4">
            <span className="sr-only">관리</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {courses.map((course) => (
          <tr key={course.id}>
            <td className="max-w-24 truncate px-3 py-3 text-sm font-medium text-foreground text-left sm:max-w-none sm:px-6 sm:py-4" title={course.title}>
              {course.title}
            </td>
            <td className="px-3 py-3 whitespace-nowrap text-sm text-muted-foreground text-left sm:px-6 sm:py-4">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 sm:px-3 sm:py-1 sm:text-sm",
                  COURSE_STATUS_COLORS[course.status]
                )}
              >
                {COURSE_STATUS_LABELS[course.status]}
              </Badge>
            </td>
            <td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
              {format(new Date(course.createdAt), "yyyy-MM-dd HH:mm")}
            </td>
            <td className="whitespace-nowrap px-3 py-3 text-right sm:px-6 sm:py-4">
              <div className="flex justify-end gap-1 sm:gap-2">
                <Button
                  onClick={() => onUpdate(course.id)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 p-0 sm:inline-flex sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
                  aria-label={`${course.title} 수정`}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="hidden sm:inline">수정</span>
                </Button>
                <Button
                  onClick={() => onDelete(course.id)}
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 shrink-0 p-0 sm:inline-flex sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
                  aria-label={`${course.title} 삭제`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">삭제</span>
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
