import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trabz - Jobs & Gigs for Filipino Workers",
  description: "Find jobs, earn money, learn skills. Your all-in-one app for employment and financial freedom.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Trabz",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/AppImages/android/android-launchericon-96-96.png",
    apple: "/AppImages/ios/180.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1E40AF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <Providers>
          <div className="pb-16">
            {children}
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
