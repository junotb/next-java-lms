import { z } from "zod";

export const PageResponse = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number(),
    size: z.number(),
    totalItems: z.number(),     // ← 당신 응답은 totalItems
    totalPages: z.number(),
    hasNext: z.boolean(),
  });

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}