"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebarContent } from "./app-sidebar-content";
import { NewChatButton } from "./ui/chat-button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  
  return (

    <Sidebar className="bg-card border-r border-border">
      <SidebarHeader className="flex h-14 flex-row justify-between items-center px-4 py-0 bg-card border-border">
        <SidebarTrigger />
        <Link href="/" className="ml-1 font-bold text-foreground text-center" onClick={() => setOpenMobile(false)}>
            Aaltoes ChatBot
          </Link>
        <NewChatButton />
      </SidebarHeader>
      <AppSidebarContent />      
    </Sidebar>
  );
}
