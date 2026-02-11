"use client";

import UserCard from "@/components/user/UserCard";
import { User } from "@/schemas/user/user";

interface UserListProps {
  users: User[];
  basePath: string;
};

export default function UserList({ users, basePath }: UserListProps) {
  return (
    <section>
      {users.length === 0 && (
        <div
          role="alert"
          className="flex justify-center items-center"
        >
          <p className="text-sm text-muted-foreground">등록된 사용자가 없습니다.</p>
        </div>
      )}
  
      {users.length > 0 && (
        <div
          role="list"
          className="flex flex-wrap gap-4 justify-center items-stretch"
        >
          {users.map((user) => (
            <UserCard key={user.id} href={`${basePath}/${user.id}`} name={user.name} />
          ))}
        </div>
      )}
    </section>
  );
}
