"use client";

import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Label } from "@/component/ui/label";
import { cn } from "@/lib/utils";

interface SelectFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validation?: RegisterOptions<T, Path<T>>;
  children: React.ReactNode;
}

export default function SelectField<T extends FieldValues>({
  id,
  label,
  register,
  errors,
  validation,
  children,
}: SelectFieldProps<T>) {
  const error = errors[id];

  return (
    <div className="w-full flex flex-col gap-2">
      <Label htmlFor={id} className="text-left text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <select
        id={id}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        {...register(id, validation)}
      >
        {children}
      </select>
      {error && <p className="text-sm text-destructive">{String(error.message)}</p>}
    </div>
  );
}
