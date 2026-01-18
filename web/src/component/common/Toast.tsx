"use client";

import { useToastStore } from "@/store/useToastStore";
import clsx from "clsx";
import { useEffect } from "react";

export default function Toast() {
  const { isVisible, message, type, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  if (!isVisible) {
    return null;
  }

  const baseClasses =
    "fixed top-4 right-4 z-[100] px-4 py-4 rounded-lg shadow-lg flex items-center transition-opacity duration-300 animate-fade-in-down";
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={clsx(baseClasses, typeClasses[type])}>
      <span>{message}</span>
      <button
        onClick={hideToast}
        className="ml-4 font-bold opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
