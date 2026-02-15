import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserListRequest, UserListFormValues } from "@/schemas/user/user";
import { UserListRequestSchema } from "@/schemas/user/user";
import { UserRoleSchema } from "@/schemas/user/user-role";
import { UserStatusSchema } from "@/schemas/user/user-status";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, RotateCcw } from "lucide-react";
import { USER_ROLE_NAMES, USER_STATUS_NAMES } from "@/constants/auth";

interface UserListFormProps {
  onSubmit: (data: UserListRequest) => void;
}

export default function UserListForm({ onSubmit }: UserListFormProps) {
  const { register, handleSubmit, reset } = useForm<UserListFormValues>({
    resolver: zodResolver(UserListRequestSchema),
    defaultValues: {
      role: undefined,
      status: undefined,
      name: "",
    },
    mode: "onSubmit",
  });

  const handleReset = () =>
    reset({
      role: undefined,
      status: undefined,
      name: "",
    });

  const handleFormSubmit = (data: UserListFormValues) => {
    onSubmit({
      name: data.name || undefined,
      role: data.role === "" ? undefined : data.role,
      status: data.status === "" ? undefined : data.status,
    });
  };

  return (
    <form
      className="flex flex-wrap items-end gap-3 sm:gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
        <Label htmlFor="name" className="shrink-0 text-sm font-medium text-foreground">
          이름
        </Label>
        <Input
          id="name"
          type="text"
          className="min-w-[4.5rem] max-w-32 px-2 py-2 text-sm h-auto sm:w-28 lg:w-32 sm:px-4"
          {...register("name")}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
        <Label htmlFor="role" className="shrink-0 text-sm font-medium text-foreground">
          역할
        </Label>
        <select
          id="role"
          className={cn(
            "flex h-10 min-w-[5rem] max-w-24 rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 lg:w-24"
          )}
          {...register("role")}
        >
          <option value="">전체</option>
          {UserRoleSchema.options.map((role) => (
            <option key={role} value={role}>
              {USER_ROLE_NAMES[role]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
        <Label htmlFor="status" className="shrink-0 text-sm font-medium text-foreground">
          상태
        </Label>
        <select
          id="status"
          className={cn(
            "flex h-10 min-w-[5rem] max-w-24 rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 lg:w-24"
          )}
          {...register("status")}
        >
          <option value="">전체</option>
          {UserStatusSchema.options.map((status) => (
            <option key={status} value={status}>
              {USER_STATUS_NAMES[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1 shrink-0 py-2 text-sm h-auto sm:flex-none sm:px-4"
        >
          <RotateCcw className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">초기화</span>
        </Button>

        <Button
          type="submit"
          className="flex-1 shrink-0 py-2 text-sm h-auto sm:flex-none sm:px-4"
        >
          <Search className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">검색</span>
        </Button>
      </div>
    </form>
  );
}
