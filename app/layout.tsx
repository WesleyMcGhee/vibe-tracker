import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { NavSidebar } from "@/components/nav-sidebar";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Invoice Creator",
  description: "Create and manage client invoices",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full flex flex-col md:flex-row antialiased">
        <NavSidebar />
        <main className="flex-1 min-h-0 overflow-auto">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
