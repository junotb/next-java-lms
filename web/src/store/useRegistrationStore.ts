import { create } from "zustand";
import type { CourseRegistrationRequest } from "@/schema/registration";

interface RegistrationStore {
  step: number;
  formData: Partial<CourseRegistrationRequest>;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<CourseRegistrationRequest>) => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  formData: {},
};

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  reset: () => set(initialState),
}));
