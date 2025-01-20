import NavBar from "../components/NavBar";
import { Toaster } from "../components/ui/toaster";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import "katex/dist/katex.min.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

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
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
      </head>
      <body className={cn(
        inter.className,
        "h-full overflow-hidden bg-background font-sans antialiased",
        "border-border"
      )}>
        <Providers>
          <main className="flex h-full w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}    
            </div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
