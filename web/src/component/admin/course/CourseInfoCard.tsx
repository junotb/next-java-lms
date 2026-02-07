"use client";

import Loader from "@/component/common/Loader";
import CourseForm from "@/component/admin/course/CourseForm";
import {
  useCourseInfo,
  useCourseCreate,
  useCourseUpdate,
  useCourseDelete,
} from "@/hook/admin/useCourse";
import {
  CourseCreateRequest,
  CourseUpdateRequest,
} from "@/schema/course/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";

interface CourseInfoCardProps {
  courseId: number | null;
  onSuccess: () => void;
}

export default function CourseInfoCard({
  courseId,
  onSuccess,
}: CourseInfoCardProps) {
  const isCreate = courseId === null;

  const { data: course, isLoading: isCourseLoading } = useCourseInfo(
    courseId ?? 0,
    { enabled: !isCreate }
  );

  const registerMutation = useCourseCreate();
  const modifyMutation = useCourseUpdate();
  const deleteMutation = useCourseDelete();

  const handleSubmit = async (
    raw: CourseCreateRequest | CourseUpdateRequest
  ) => {
    try {
      if (isCreate) {
        const payload = raw as CourseCreateRequest;
        await registerMutation.mutateAsync(payload);
      } else {
        if (courseId === null) return;
        const payload = raw as CourseUpdateRequest;
        await modifyMutation.mutateAsync({ courseId, payload });
      }
      onSuccess();
    } catch {
      // onError는 mutation에서 처리됨
    }
  };

  const handleDelete = async () => {
    if (courseId === null) return;
    await deleteMutation.mutateAsync(courseId);
    onSuccess();
  };

  const title = isCreate ? "강의 등록" : "강의 수정";
  const isMutating = registerMutation.isPending || modifyMutation.isPending;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-3xl lg:text-4xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-1 flex items-center justify-center">
          {isCourseLoading || isMutating ? (
            <Loader />
          ) : (
            <CourseForm
              initialData={course}
              onSubmit={handleSubmit}
              onDelete={!isCreate ? handleDelete : undefined}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
