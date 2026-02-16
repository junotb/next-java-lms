"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Sonner 토스트 컨테이너.
 * layout.tsx에 추가하여 toast() 호출 시 노출.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toaster]:text-muted-foreground",
          actionButton:
            "group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground",
          cancelButton:
            "group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
