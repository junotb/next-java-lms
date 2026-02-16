import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스 병합 유틸.
 * clsx로 조건부 클래스를 합치고 tailwind-merge로 충돌 제거.
 *
 * @param inputs - className 문자열 또는 조건부 객체
 * @returns 병합된 className 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
