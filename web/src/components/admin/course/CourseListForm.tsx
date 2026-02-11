import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  CourseListRequest,
  CourseListFormValues,
} from "@/schemas/course/course";
import { CourseListRequestSchema } from "@/schemas/course/course";
import { CourseStatus, CourseStatusSchema } from "@/schemas/course/course-status";
import { COURSE_STATUS_LABELS } from "@/constants/course";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, RotateCcw } from "lucide-react";

interface CourseListFormProps {
  onSubmit: (data: CourseListRequest) => void;
}

export default function CourseListForm({ onSubmit }: CourseListFormProps) {
  const { register, handleSubmit, reset } = useForm<CourseListFormValues>({
    resolver: zodResolver(CourseListRequestSchema),
    defaultValues: {
      title: undefined,
      status: undefined,
    },
    mode: "onSubmit",
  });

  const handleReset = () =>
    reset({
      title: undefined,
      status: undefined,
    });

  const handleFormSubmit = (data: CourseListFormValues) => {
    // 스키마에서 빈 문자열을 undefined로 변환하므로 그대로 전달
    onSubmit(data);
  };

  return (
    <form
      className="flex flex-wrap justify-start items-end gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-sm font-medium text-foreground">
          제목
        </Label>
        <Input
          id="title"
          type="text"
          className="px-2 lg:px-4 py-2 w-20 lg:w-32 text-sm h-auto"
          {...register("title")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status" className="text-sm font-medium text-foreground">
          상태
        </Label>
        <select
          id="status"
          className={cn(
            "flex h-10 w-20 lg:w-24 rounded-md border border-input bg-background px-2 lg:px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          {...register("status")}
        >
          <option value="">전체</option>
          {Object.values(CourseStatus).map((status) => (
            <option key={status} value={status}>
              {COURSE_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="px-2 lg:px-4 py-2 text-sm h-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          초기화
        </Button>

        <Button
          type="submit"
          className="px-2 lg:px-4 py-2 text-sm h-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          검색
        </Button>
      </div>
    </form>
  );
}
