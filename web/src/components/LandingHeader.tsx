"use client";

import BookOpenIcon from "@/assets/icons/book-open.svg";
import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="sticky flex justify-center top-0 z-40 border-b w-full bg-background">
      <div className="flex items-center justify-between px-4 h-16 w-full">
        <div className="flex items-center space-x-2">
          <BookOpenIcon />
          <h1 className="font-bold">NexLang</h1>
        </div>
        <div>
          <Link href="/login" aria-label="로그인 페이지로 이동" className="px-4 py-2 rounded-md hover:bg-slate-100 transition">
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}