import { User } from "@/schemas/user/user";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  USER_ROLE_NAMES,
  USER_STATUS_NAMES,
  USER_ROLE_COLORS,
  USER_STATUS_COLORS,
} from "@/constants/auth";

interface UserListTableProps {
  users: User[];
  onUpdate: (userId: string) => void;
}

export default function UserListTable({ users, onUpdate }: UserListTableProps) {
  return (
    <table className="w-full min-w-[36rem] divide-y divide-border table-auto">
      <thead className="bg-muted">
        <tr>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            이름
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            이메일
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            역할
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            상태
          </th>
          <th scope="col" className="relative px-3 py-3 sm:px-6 sm:py-4">
            <span className="sr-only">수정</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-foreground text-left sm:px-6 sm:py-4">
              {user.name}
            </td>
            <td className="max-w-24 truncate px-3 py-3 text-sm text-muted-foreground text-left sm:max-w-none sm:px-6 sm:py-4" title={user.email}>
              {user.email}
            </td>
            <td className="px-3 py-3 whitespace-nowrap text-sm text-muted-foreground text-left sm:px-6 sm:py-4">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 sm:px-3 sm:py-1 sm:text-sm",
                  USER_ROLE_COLORS[user.role]
                )}
              >
                {USER_ROLE_NAMES[user.role]}
              </Badge>
            </td>
            <td className="px-3 py-3 whitespace-nowrap text-sm text-muted-foreground text-left sm:px-6 sm:py-4">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 sm:px-3 sm:py-1 sm:text-sm",
                  USER_STATUS_COLORS[user.status]
                )}
              >
                {USER_STATUS_NAMES[user.status]}
              </Badge>
            </td>
            <td className="px-3 py-3 whitespace-nowrap text-right sm:px-6 sm:py-4">
              <Button
                onClick={() => onUpdate(user.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 shrink-0 p-0 sm:inline-flex sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
                aria-label={`${user.name} 수정`}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">수정</span>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
