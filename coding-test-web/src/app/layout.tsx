import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coding Test Grader",
  description: "코딩테스트 풀이 복습 & 채점 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        <header className="pt-8 pb-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
            <Link href="/" className="text-3xl font-bold">
              Coding Test
            </Link>
            <nav>
              <Link
                href="/problems/new"
                className="text-white text-sm font-medium hover:text-gray-300 transition-colors"
              >
                + 문제 추가
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
