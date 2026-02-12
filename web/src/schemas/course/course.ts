import { z } from "zod";
import { CourseStatusSchema } from "./course-status";

export const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: CourseStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;

// 강의 생성 요청 스키마
export const CourseCreateRequestSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요."),
  description: z.string().nullable().optional(),
  status: CourseStatusSchema,
});

export type CourseCreateRequest = z.infer<typeof CourseCreateRequestSchema>;

// 강의 수정 요청 스키마
export const CourseUpdateRequestSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요.").optional(),
  description: z.string().nullable().optional(),
  status: CourseStatusSchema.optional(),
});

export type CourseUpdateRequest = z.infer<typeof CourseUpdateRequestSchema>;

// 강의 목록 요청 스키마
export const CourseListRequestSchema = z.object({
  title: z.string().optional(),
  status: CourseStatusSchema.optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
});

export type CourseListRequest = z.infer<typeof CourseListRequestSchema>;

// 강의 생성 폼 타입
export type CourseCreateFormValues = CourseCreateRequest;

// 강의 수정 폼 타입
export type CourseUpdateFormValues = CourseUpdateRequest;

// 강의 목록 폼 타입 (폼 입력은 "" 허용, onSubmit 시 transform으로 undefined 변환)
export type CourseListFormValues = z.input<typeof CourseListRequestSchema>;
