import NavBar from "../components/NavBar";
import { Toaster } from "../components/ui/toaster";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Aaltoes Chatbot",
    absolute: "Aaltoes Chatbot",
  },
  description:
    "This is a chatbot for Aaltoes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className+' overflow-hidden'} >
        <SessionProvider>
          <NavBar />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
