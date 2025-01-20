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
    <Sidebar className="bg-card border-r border-border">
      <SidebarHeader className="flex h-14 flex-row justify-between items-center px-4 py-0 bg-card border-border">
        <SidebarTrigger />
        <NewChatButton />
      </SidebarHeader>
      <AppSidebarContent />
      
    
          
    </Sidebar>
  );
}
