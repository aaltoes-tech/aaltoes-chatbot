import { Toaster } from "../components/ui/toaster";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import "katex/dist/katex.min.css";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: {
    template: "%s | Aaltoes Chatbot",
    absolute: "Aaltoes Chatbot",
  },
  description: "This is a chatbot for Aaltoes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistMono.className}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
      </head>
      <body className={cn("h-full w-full bg-background font-sans antialiased")}>
        <Providers>
          <AppSidebar />
          <main className="relative h-svh w-full overflow-auto">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
