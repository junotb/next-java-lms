import { create } from "zustand";
import type { AuthModalStore } from "@/types/store";

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  modalType: null, // 초기값은 닫힘 상태
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
}));
