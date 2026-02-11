/**
 * Zustand Store 관련 타입 정의
 */

import type { CourseRegistrationRequest } from "@/schemas/registration";

// Toast Store
export type ToastType = "success" | "error" | "info";

export interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

// Auth Modal Store
export type AuthModalType = "signin" | "signup" | null;

export interface AuthModalStore {
  modalType: AuthModalType;
  openModal: (type: AuthModalType) => void;
  closeModal: () => void;
}

// Registration Store
export interface RegistrationStore {
  step: number;
  formData: Partial<CourseRegistrationRequest>;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<CourseRegistrationRequest>) => void;
  reset: () => void;
}
