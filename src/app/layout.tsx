import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";

import "./globals.css";

import { ClientToaster } from "@/components";
import { AuthProvider } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WMS System - Warehouse Management",
  description: "Warehouse Management System for efficient inventory control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
          <ClientToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
