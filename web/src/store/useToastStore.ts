import { create } from "zustand";
import type { ToastState } from "@/types/store";

export const useToastStore = create<ToastState>((set) => ({
  isVisible: false,
  message: "",
  type: "info",
  showToast: (message, type = "info") =>
    set({ message, type, isVisible: true }),
  hideToast: () => set({ isVisible: false, message: "" }),
}));
