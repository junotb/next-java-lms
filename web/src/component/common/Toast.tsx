"use client";

import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/utils";
import { Button } from "@/component/ui/button";
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

  const typeClasses = {
    success: "bg-primary text-primary-foreground",
    error: "bg-destructive text-destructive-foreground",
    info: "bg-primary text-primary-foreground",
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-[100] px-4 py-4 rounded-lg shadow-lg flex items-center transition-opacity duration-300 animate-fade-in-down",
        typeClasses[type]
      )}
    >
      <span>{message}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={hideToast}
        className="ml-4 h-auto w-auto p-0 font-bold opacity-70 hover:opacity-100 hover:bg-transparent"
      >
        ✕
      </Button>
    </div>
  );
}
