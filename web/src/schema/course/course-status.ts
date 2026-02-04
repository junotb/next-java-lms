import { z } from "zod";

export enum CourseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const CourseStatusSchema = z.nativeEnum(CourseStatus);
