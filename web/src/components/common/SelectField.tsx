"use client";

import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  validation?: RegisterOptions<T, Path<T>>;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * React Hook Form Controller + Shadcn Select 연동 필드.
 */
export default function SelectField<T extends FieldValues>({
  id,
  label,
  control,
  errors,
  validation,
  options,
  placeholder = "선택하세요",
}: SelectFieldProps<T>) {
  const error = errors[id];

  return (
    <div className="w-full flex flex-col gap-2">
      <Label htmlFor={id} className="text-left text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <Controller
        name={id}
        control={control}
        rules={validation}
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            onValueChange={(v) => field.onChange(v || undefined)}
          >
            <SelectTrigger
              id={id}
              className={cn(
                "w-full",
                error && "border-destructive focus:ring-destructive"
              )}
              aria-invalid={!!error}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-destructive">{String(error.message)}</p>}
    </div>
  );
}
