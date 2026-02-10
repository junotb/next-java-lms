import { create } from "zustand";
import type { RegistrationStore } from "@/types/store";

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
