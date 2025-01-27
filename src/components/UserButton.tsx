"use client"

import { Lock, LogOut, Settings, Home, Moon, Sun } from "@geist-ui/icons";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";


interface UserButtonProps {
  user: User 
}

export default function UserButton({ user }: UserButtonProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 h-auto p-2 hover:bg-accent font-sans normal-case"
        >
          <div className="w-8 h-8 relative">
            <Image
              src={user.image || "/avatar-fallback.png"}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="text-left hidden md:block">
            <div className="font-medium text-sm text-foreground font-sans">{user.name}</div>
            <div className="text-xs text-muted-foreground font-sans">{user.email}</div>
          </div>

        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64" 
        align="end"
        alignOffset={4}
      >
        <div className="px-2 py-2.5 md:hidden font-sans">
          <div className="font-medium text-sm text-foreground">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
        <DropdownMenuGroup className="p-1 ">
          <DropdownMenuItem asChild className="focus:ring-0 focus-visible:ring-0">
            <Link href="/" className="flex items-center gap-2 px-2 py-2 cursor-pointer">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 px-2 py-2 cursor-pointer">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          {user.role === "Admin" && user.active && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2 px-2 py-2 cursor-pointer">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-2 py-2 cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-2 py-2 text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
