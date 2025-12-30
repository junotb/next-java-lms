"use client";

import Link from "next/link";
import BookOpenIcon from "@/asset/icon/book-open.svg";
import { useAuthModalStore } from "@/store/useAuthModalStore";

export default function LandingHeader() {
  const { openModal } = useAuthModalStore();
  
  return (
    <header className="sticky flex justify-center top-0 z-40 border-b w-full bg-background">
      <div className="flex items-center justify-between px-4 h-16 w-full">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpenIcon />
          <h1 className="font-bold">NexLang</h1>
        </Link>
        <div>
          <button
            onClick={() => openModal("LOGIN")}
            aria-label="로그인 페이지로 이동"
            className="px-4 py-2 rounded-md hover:bg-slate-100 transition"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}