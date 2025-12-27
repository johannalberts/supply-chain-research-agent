import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SettingsProvider } from "@/lib/settings-context";
import BackgroundPattern from "@/components/BackgroundPattern";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supply Chain Intelligence Dashboard",
  description: "Real-time supply chain risk analysis and monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased sci-scrollbar`}
      >
        <SettingsProvider>
          <AuthProvider>
            <BackgroundPattern />
            {children}
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
