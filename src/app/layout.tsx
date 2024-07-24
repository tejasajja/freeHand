import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter as FontSans } from "next/font/google"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreeHandDraw",
  description: "",
};

import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable ,inter.className
        )} >
      {/* <Provider> */}
      <main className="h-screen flex flex-col justify-center items-center">
        <Navbar/>
        {children}
      </main>
      {/* </Provider> */}
    </body>
    </html>
  );
}
