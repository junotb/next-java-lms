import { z } from "zod";
import { DAYS_OF_WEEK } from "./registration-request";

export const CandidateSearchRequestSchema = z.object({
  days: z
    .array(z.enum(DAYS_OF_WEEK))
    .min(1, "희망 요일을 최소 1개 이상 선택해주세요."),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "HH:MM 형식이어야 합니다."),
  durationMinutes: z.number().int().positive(),
});

export type CandidateSearchRequest = z.infer<typeof CandidateSearchRequestSchema>;

export const TeacherCandidateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

export type TeacherCandidate = z.infer<typeof TeacherCandidateSchema>;
