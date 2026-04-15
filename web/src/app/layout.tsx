import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Providers } from "@/lib/wagmi/providers";
import { baseAppId, siteUrl } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Simple Space Station",
  description:
    "Swipe-controlled neon station repair game on Base — daily check-in included.",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
  openGraph: {
    title: "Simple Space Station",
    description: "Orbital repairs, neon grid, Base check-in.",
    images: [{ url: "/thumbnail.jpg", width: 1200, height: 628 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#030508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-[#030508] antialiased`}
      style={{ backgroundColor: "#030508", colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body
        className="scanlines min-h-dvh bg-[#030508] font-sans text-zinc-100"
        style={{ backgroundColor: "#030508", color: "#e8f4ff" }}
      >
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
