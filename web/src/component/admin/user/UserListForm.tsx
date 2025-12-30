import { useForm } from "react-hook-form";
import type { UserListRequest, UserListFormValues } from "@/schema/user/user";

interface UserListFormProps {
  onSubmit: (data: UserListRequest) => void;
}

export default function UserListForm({ onSubmit }: UserListFormProps) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<UserListFormValues>({
    defaultValues: {
      role: undefined,
      status: undefined,
      lastName: "",
      firstName: "",
    },
    mode: "onSubmit",
  });

  const handleReset = () => reset({
    role: undefined,
    status: undefined,
    lastName: "",
    firstName: "",
  });
  
  return (
    <form
      className="flex flex-wrap justify-center items-end gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="lastName"
          className="text-sm font-medium text-gray-700"
        >
          성
        </label>
        <input
          id="lastName"
          type="text"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-32 text-sm rounded-md"
          {...register("lastName")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="firstName"
          className="text-sm font-medium text-gray-700"
        >
          이름
        </label>
        <input
          id="firstName"
          type="text"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-32 text-sm rounded-md"
          {...register("firstName")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="role"
          className="text-sm font-medium text-gray-700"
        >
          역할
        </label>
        <select
          id="role"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-24 text-sm rounded-md"
          {...register("role")}
        >
          <option value="">전체</option>
          <option value="STUDENT">학생</option>
          <option value="TEACHER">강사</option>
          <option value="ADMIN">관리자</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="status"
          className="text-sm font-medium text-gray-700"
        >
          상태
        </label>
        <select
          id="status"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-24 text-sm rounded-md"
          {...register("status")}
        >
          <option value="">전체</option>
          <option value="ACTIVE">활성</option>
          <option value="INACTIVE">비활성</option>
        </select>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="border px-2 lg:px-4 py-2 text-sm rounded-md cursor-pointer"
        >
          초기화
        </button>

        <button
          type="submit"
          className="border border-blue-600 bg-blue-600 text-white px-2 lg:px-4 py-2 text-sm rounded-md hover:bg-blue-700 cursor-pointer"
        >
          검색
        </button>
      </div>
    </form>
  );
}