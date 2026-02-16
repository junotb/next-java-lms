import { Course } from "@/schemas/course/course";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { COURSE_STATUS_LABELS, COURSE_STATUS_COLORS } from "@/constants/course";

/**
 * 강좌 목록 테이블.
 * 제목, 상태, 생성일, 수정/삭제 액션.
 */
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>생성일</TableHead>
          <TableHead className="relative">
            <span className="sr-only">관리</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell
              className="max-w-24 truncate font-medium sm:max-w-none"
              title={course.title}
            >
              {course.title}
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 sm:px-3 sm:py-1 sm:text-sm",
                  COURSE_STATUS_COLORS[course.status]
                )}
              >
                {COURSE_STATUS_LABELS[course.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-xs sm:text-sm">
              {format(new Date(course.createdAt), "yyyy-MM-dd HH:mm")}
            </TableCell>
            <TableCell className="text-right">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
