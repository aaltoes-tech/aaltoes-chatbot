"use client";

import { getSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { MODELS } from "../lib/constants";
import { usePathname } from "next/navigation";

interface NavBarProps {
    onMenuClick?: () => void;
}

export default function NavBar({ onMenuClick }: NavBarProps = {}) {
    const { data: session, update, status } = useSession();
    const user = session?.user;
    const [selectedModel, setSelectedModel] = useState(session?.user?.model || 'gpt-4o-mini');
    const pathname = usePathname();
    
    const isChatPage = pathname.startsWith('/chat/');

    const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newModel = e.target.value;
        setSelectedModel(newModel);
    };

    return (
        <header className="sticky top-0 shadow-sm">
            <nav className="mx-auto flex h-14 w-full max-w-8xl items-center justify-between px-3 gap-3 bg-background">
                <div className="flex items-center gap-4">
                    {onMenuClick && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onMenuClick}
                            className="md:hidden hover:bg-gray-100"
                        >
                            <Menu size={20} />
                        </Button>
                    )}
                    <Link href="/" className="font-bold">
                        Aaltoes ChatBot
                    </Link>
                    {isChatPage && (
                        <div className="relative">
                            <select 
                                onChange={handleModelChange} 
                                value={selectedModel}
                                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1 pr-8 
                                         text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none 
                                         focus:ring-2 focus:ring-blue-500"
                            >
                                {Object.keys(MODELS).map((model) => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
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
