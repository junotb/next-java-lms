import { Course } from "@/schema/course/course";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/component/ui/badge";
import { Button } from "@/component/ui/button";
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
    <table className="min-w-full divide-y divide-border">
      <thead className="bg-muted">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            제목
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            상태
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            생성일
          </th>
          <th scope="col" className="relative px-6 py-4">
            <span className="sr-only">관리</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {courses.map((course) => (
          <tr key={course.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-left">
              {course.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5",
                  COURSE_STATUS_COLORS[course.status]
                )}
              >
                {COURSE_STATUS_LABELS[course.status]}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              {format(new Date(course.createdAt), "yyyy-MM-dd HH:mm")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => onUpdate(course.id)}
                  className="px-2 lg:px-4 py-2 text-sm"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  수정
                </Button>
                <Button
                  onClick={() => onDelete(course.id)}
                  variant="destructive"
                  className="px-2 lg:px-4 py-2 text-sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
