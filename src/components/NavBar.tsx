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

interface NavBarProps {
  onMenuClick?: () => void;
}

export default function NavBar({ onMenuClick }: NavBarProps = {}) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [selectedModel, setSelectedModel] = useState(
    session?.user?.model || "gpt-4o-mini",
  );
  const pathname = usePathname();

  const isChatPage = pathname.startsWith("/chat/");

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
  };

  const { open } = useSidebar();

  return (
    <header className="sticky top-0 shadow-sm">
      <nav className="max-w-8xl mx-auto flex h-14 w-full items-center justify-between gap-3 bg-background px-2">
        <div className="flex items-center gap-2">
          {!open && (
            <div className="flex gap-1 items-center">
              <SidebarTrigger />
              <NewChatButton />
            </div>
          )}
          <Link href="/" className="ml-1 font-bold">
            Aaltoes ChatBot
          </Link>
          {isChatPage && (
            <div className="relative">
              <select
                onChange={handleModelChange}
                value={selectedModel}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(MODELS).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={14}
              />
            </div>
          )}
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
