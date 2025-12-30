"use client";

import SignInForm from "@/component/auth/SignInForm";
import SignUpForm from "@/component/auth/SignUpForm";
import Loader from "@/component/Loader";
import { authClient } from "@/lib/auth-client"; 
import { BetterError, SignInEmailRequest, SignUpEmailRequest } from "@/schema/auth";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useState } from "react";

export default function AuthModalContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BetterError | null>(null);

  const { modalType, openModal, closeModal } = useAuthModalStore();
  
  if (!modalType) return null;

  const handleSignIn = async (payload: SignInEmailRequest) => {
    const { data, error } = await authClient.signIn.email(payload, {
      onRequest: () => setIsLoading(true),
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });
    
    console.log(data);
    if (error) setError(error);
  }

  const handleSignUp = async (payload: SignUpEmailRequest) => {
    const { data, error } = await authClient.signUp.email(payload, {
      onRequest: () => {
        console.log("Signing up with payload:", payload);
        setIsLoading(true);
      },
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });
    
    console.log(data);
    if (error) setError(error);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4"
      onClick={closeModal}
    >
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-4xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="p-8 sm:p-10">
          <button 
            onClick={closeModal}
            className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>

          {isLoading && <Loader />}
          {!isLoading && modalType === 'LOGIN' && <SignInForm error={error} onSubmit={handleSignIn} />}
          {!isLoading && modalType === 'SIGNUP' && <SignUpForm error={error} onSubmit={handleSignUp} />}

          <button
            onClick={() => openModal(modalType === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
            className="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-600 underline"
          >
            {modalType === 'LOGIN' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>
      </div>
    </div>
  );
}