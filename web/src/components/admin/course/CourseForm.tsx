"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Course,
  CourseCreateRequest,
  CourseUpdateRequest,
  CourseCreateFormValues,
  CourseUpdateFormValues,
} from "@/schemas/course/course";
import {
  CourseCreateRequestSchema,
  CourseUpdateRequestSchema,
} from "@/schemas/course/course";
import { CourseStatus, CourseStatusSchema } from "@/schemas/course/course-status";
import { COURSE_STATUS_LABELS } from "@/constants/course";
import InputField from "@/components/common/InputField";
import TextareaField from "@/components/common/TextareaField";
import SelectField from "@/components/common/SelectField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface CourseFormProps {
  initialData?: Course;
  onSubmit: (data: CourseCreateRequest | CourseUpdateRequest) => void;
  onDelete?: () => void;
}

export default function CourseForm({
  initialData,
  onSubmit,
  onDelete,
}: CourseFormProps) {
  const isCreate = !initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseCreateFormValues | CourseUpdateFormValues>({
    resolver: zodResolver(
      isCreate ? CourseCreateRequestSchema : CourseUpdateRequestSchema
    ),
        defaultValues: isCreate
      ? {
          title: "",
          description: "",
          status: CourseStatus.ACTIVE,
        }
      : {
          title: initialData.title,
          description: initialData.description || "",
          status: initialData.status,
        },
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (isCreate) {
          const payload: CourseCreateRequest = {
            title: values.title,
            description: values.description || null,
            status: values.status,
          };
          onSubmit(payload);
        } else {
          const payload: CourseUpdateRequest = {
            ...(values.title && { title: values.title }),
            ...(values.description !== undefined && {
              description: values.description || null,
            }),
            ...(values.status && { status: values.status }),
          };
          onSubmit(payload);
        }
      })}
      className="flex flex-col gap-4 w-full"
    >
      <InputField
        id="title"
        label="제목"
        register={register}
        errors={errors}
      />

      <TextareaField
        id="description"
        label="설명"
        placeholder="강의 설명을 입력하세요."
        register={register}
        errors={errors}
      />

      <SelectField
        id="status"
        label="상태"
        register={register}
        errors={errors}
      >
        {Object.values(CourseStatus).map((status) => (
          <option key={status} value={status}>
            {COURSE_STATUS_LABELS[status]}
          </option>
        ))}
      </SelectField>

      <div className="flex justify-center gap-4 w-full">
        <Button
          type="submit"
          className={cn(
            "mt-4 flex-1 rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
          )}
          disabled={isSubmitting}
        >
          {isCreate ? "등록" : "수정"}
        </Button>

        {!isCreate && onDelete && (
          <Button
            type="button"
            onClick={onDelete}
            variant="destructive"
            className={cn(
              "mt-4 flex-1 rounded-xl px-8 py-3 font-bold shadow-lg shadow-destructive/20 transition-all hover:-translate-y-0.5"
            )}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        )}
      </div>
    </form>
  );
}
