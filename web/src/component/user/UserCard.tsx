"use client";

import Link from "next/link";
import UserIcon from "@/asset/icon/user.svg";

interface UserCardProps {
  href: string;
  name: string;
}

export default function UserCard({ href, name }: UserCardProps) {
  return (
    <Link
      href={href}
      className="rounded-2xl border bg-card active:bg-muted p-4 shadow active:shadow-xl transition"
      role="listitem"
      aria-label={`${name} 카드`}
    >
      <div className="flex flex-col items-center gap-2">
        <UserIcon className="w-12 h-12 fill-black" />
        <div className="text-center">
          <h3 className="text-base font-semibold">{name}</h3>
        </div>
      </div>
    </Link>
  );
}
