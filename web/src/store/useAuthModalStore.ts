"use client";

import { create } from 'zustand';

type AuthModalType = 'LOGIN' | 'SIGNUP' | 'FIND_PASSWORD' | null;

interface AuthModalStore {
  modalType: AuthModalType;
  openModal: (type: AuthModalType) => void;
  closeModal: () => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  modalType: null, // 초기값은 닫힘 상태
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
}));