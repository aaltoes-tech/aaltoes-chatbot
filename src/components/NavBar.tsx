"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { NewChatButton } from "./ui/chat-button";
import { SelectModel } from "./Chatbot/select-model";

export default function NavBar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const isChatPage = pathname.startsWith("/chat/") || pathname === "/";

  const { open, openMobile, isMobile } = useSidebar();

  return (
    <header className="sticky left-0 right-0 top-0 z-50 h-14 border-b border-border bg-card/80 backdrop-blur">
      <nav className="max-w-8xl mx-auto flex h-full w-full items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          {(isMobile && !openMobile) || (!isMobile && !open) ? (
            <div className="flex items-center gap-1">
              <SidebarTrigger />
              <NewChatButton />
            </div>
          ) : null}
          {(!isMobile && !open) || isMobile ? (
            <Link
              href="/"
              className="ml-1 text-center font-bold text-foreground">
              Aaltoes ChatBot
            </Link>
          ) : null}
          {isChatPage && !isMobile ? <SelectModel /> : null}
        </div>

        <div className="flex items-center gap-2">
          {user && <UserButton user={user} />}
          {!user && status !== "loading" && (
            <Button onClick={() => signIn()}>Sign in</Button>
          )}
        </div>
      </nav>
    </header>
  );
}
