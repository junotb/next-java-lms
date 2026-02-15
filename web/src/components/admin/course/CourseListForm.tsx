import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  CourseListRequest,
  CourseListFormValues,
} from "@/schemas/course/course";
import { CourseListRequestSchema } from "@/schemas/course/course";
import { CourseStatus } from "@/schemas/course/course-status";
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
    onSubmit({
      title: data.title,
      status: data.status === "" ? undefined : data.status,
    });
  };

  return (
    <form
      className="flex flex-wrap items-end gap-3 sm:gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
        <Label htmlFor="title" className="shrink-0 text-sm font-medium text-foreground">
          제목
        </Label>
        <Input
          id="title"
          type="text"
          className="min-w-[4.5rem] max-w-32 px-2 py-2 text-sm h-auto sm:w-28 lg:w-32 sm:px-4"
          {...register("title")}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
        <Label htmlFor="status" className="shrink-0 text-sm font-medium text-foreground">
          상태
        </Label>
        <select
          id="status"
          className={cn(
            "flex h-10 min-w-[5rem] max-w-24 rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 lg:w-24"
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

      <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1 shrink-0 py-2 text-sm h-auto sm:flex-none sm:px-4"
        >
          <RotateCcw className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">초기화</span>
        </Button>

        <Button
          type="submit"
          className="flex-1 shrink-0 py-2 text-sm h-auto sm:flex-none sm:px-4"
        >
          <Search className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">검색</span>
        </Button>
      </div>
    </form>
  );
}
