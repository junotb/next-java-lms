"use client";

import Link from "next/link";
import ArrowLeftEndOnRectangle from "@/asset/icon/arrow-left-end-on-rectangle.svg";
import BookOpenIcon from "@/asset/icon/book-open.svg";
import { useAuthModalStore } from "@/store/useAuthModalStore";

export default function LandingHeader() {
  const { openModal } = useAuthModalStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpenIcon />
          <h1 className="font-bold">NexLang</h1>
        </Link>
        <div>
          <button
            onClick={() => openModal("signin")}
            className="p-2 text-slate-500 transition-colors hover:text-slate-800"
            aria-label="로그인"
          >
            <ArrowLeftEndOnRectangle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
