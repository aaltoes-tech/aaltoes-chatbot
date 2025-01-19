"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "./ui/sidebar";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
