import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "ClipMindAI – AI Story Reel Studio",
  description: "Create viral story reels in minutes with full AI pipeline",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-[#080a12] text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
