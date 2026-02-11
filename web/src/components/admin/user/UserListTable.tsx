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
    <table className="min-w-full divide-y divide-border">
      <thead className="bg-muted">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            이름
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            이메일
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            역할
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            상태
          </th>
          <th scope="col" className="relative px-6 py-4">
            <span className="sr-only">수정</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-left">
              {user.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              {user.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5",
                  USER_ROLE_COLORS[user.role]
                )}
              >
                {USER_ROLE_NAMES[user.role]}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5",
                  USER_STATUS_COLORS[user.status]
                )}
              >
                {USER_STATUS_NAMES[user.status]}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
              <Button
                onClick={() => onUpdate(user.id)}
                className="px-2 lg:px-4 py-2 text-sm"
              >
                <Pencil className="mr-2 h-4 w-4" />
                수정
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
