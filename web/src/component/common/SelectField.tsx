"use client";

import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

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
      <label
        htmlFor={id}
        className="text-left text-sm font-medium text-gray-500"
      >
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
        {...register(id, validation)}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-500">{String(error.message)}</p>}
    </div>
  );
}
