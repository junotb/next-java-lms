import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/app/providers";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {title: {
    default: "넥스랭 (NexLang) | 성인을 위한 차세대 AI 언어 교육",
    template: "%s | NexLang"
  },
  description: "강사와 실시간 1:1 화상 수업 후, LLM 기반의 AI 피드백으로 완성하는 성인 전문 언어 학습 솔루션입니다.",
  keywords: ["넥스랭", "NexLang", "영어회화", "비즈니스영어", "AI피드백", "화상영어", "1대1영어", "에듀테크"],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} antialiased min-h-screen bg-background text-foreground`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
