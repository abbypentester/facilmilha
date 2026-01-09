import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { auth } from "@/auth";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FacilMilha - Marketplace Seguro",
  description: "Compra e venda de passagens com milhas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="pt-BR">
      <body 
        className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50`}
        suppressHydrationWarning={true}
      >
        <Navbar user={session?.user} />
        <main className="container mx-auto py-8 px-4 relative z-10">
            {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
