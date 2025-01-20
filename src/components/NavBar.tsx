"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { MODELS } from "../lib/constants";
import { usePathname } from "next/navigation";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { NewChatButton } from "./ui/chat-button";
import { SelectModel } from "./Chatbot/select-model";

interface NavBarProps {
  onMenuClick?: () => void;
}

export default function NavBar({ onMenuClick }: NavBarProps = {}) {
  const { data: session, status, update } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const isChatPage = pathname.startsWith("/chat/");


  const { open, openMobile, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav className="max-w-8xl mx-auto flex h-14 w-full items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          {(isMobile && !openMobile) || (!isMobile && !open) ? (
            <div className="flex items-center gap-1">
              <SidebarTrigger />
              <NewChatButton />
            </div>
          ) : null}
          <Link href="/" className="ml-1 font-bold text-foreground text-center">
            Aaltoes ChatBot
          </Link>
          {(isChatPage && !isMobile) ?(
           <SelectModel  />): null}
        </div>

        <div className="flex items-center gap-2">
          {user && <UserButton user={user} />}
          {!user && status !== "loading" && <SignInButton />}
        </div>
      </nav>
    </header>
  );
}

function SignInButton() {
  return <Button onClick={() => signIn()}>Sign in</Button>;
}
