"use client";

import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

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
      <label
        htmlFor={id}
        className="text-left text-sm font-medium text-gray-500"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        {...register(id, validation)}
      />
      {error && <p className="text-sm text-red-500">{String(error.message)}</p>}
    </div>
  );
}
