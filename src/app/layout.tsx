import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { PHProvider } from "@/components/providers/PostHogProvider";

export const metadata: Metadata = {
  title: "Senjr | Scale your learning with Mentorship",
  description: "Connect with elite mentors for 1-on-1 sessions. Scale your skills with Senjr.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      >
        <body className="min-h-full flex flex-col bg-slate-950 text-slate-50">
          <PHProvider>{children}</PHProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
