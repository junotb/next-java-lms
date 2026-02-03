"use client";

import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { cn } from "@/lib/utils";

interface InputFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validation?: RegisterOptions<T, Path<T>>;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
}

export default function InputField<T extends FieldValues>({
  id,
  label,
  type = "text",
  register,
  errors,
  validation,
  placeholder,
  disabled,
  defaultValue,
}: InputFieldProps<T>) {
  const error = errors[id];

  return (
    <div className="w-full flex flex-col gap-2">
      <Label htmlFor={id} className="text-left text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
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
