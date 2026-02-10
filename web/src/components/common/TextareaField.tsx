"use client";

import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Textarea } from "@/component/ui/textarea";
import { Label } from "@/component/ui/label";
import { cn } from "@/lib/utils";

interface TextareaFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validation?: RegisterOptions<T, Path<T>>;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
}

export default function TextareaField<T extends FieldValues>({
  id,
  label,
  register,
  errors,
  validation,
  placeholder,
  disabled,
  defaultValue,
}: TextareaFieldProps<T>) {
  const error = errors[id];

  return (
    <div className="w-full flex flex-col gap-2">
      <Label htmlFor={id} className="text-left text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
        className={cn(
          "w-full",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        {...register(id, validation)}
      />
      {error && <p className="text-sm text-destructive">{String(error.message)}</p>}
    </div>
  );
}
