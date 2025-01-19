"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebarContent } from "./app-sidebar-content";
import { NewChatButton } from "./ui/chat-button";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 flex-row justify-between items-center px-4 py-0">
        <SidebarTrigger />
        <NewChatButton />
      </SidebarHeader>
      <AppSidebarContent />
      <SidebarFooter />
    </Sidebar>
  );
}
