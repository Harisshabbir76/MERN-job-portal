"use client";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap
import "./globals.css"; // Global Styles
import Navbar from "@/components/CustomNavbar"; // Import Navbar component
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/register" || pathname === "/login";

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={isAuthPage ? "background-gradient" : ""}>
        {!isAuthPage && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
