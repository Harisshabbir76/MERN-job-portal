"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap
import "./globals.css"; // Global Styles
import Navbar from "@/components/CustomNavbar"; // Import Navbar component
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/register" || pathname === "/login"; 

  return (
    <html lang="en">
      <body className={`${isAuthPage ? "background-gradient" : ""} ${geistSans.variable} ${geistMono.variable}`}>
        {!isAuthPage && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
