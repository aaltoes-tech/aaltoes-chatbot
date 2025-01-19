"use client"

import { Lock, LogOut, Settings, Home, Moon, Sun } from "lucide-react";
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
          className="flex items-center gap-2 h-auto p-2 hover:bg-gray-100 border-0 ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div className="w-8 h-8 relative">
            <Image
              src={user.image || "/avatar-fallback.png"}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="hidden md:block text-left">
            <div className="font-medium text-sm">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 border-0 shadow-lg focus:ring-0 focus-visible:ring-0" 
        align="end"
        alignOffset={4}
      >
        <div className="px-2 py-2.5 md:hidden">
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem asChild className="focus:ring-0 focus-visible:ring-0">
            <Link href="/" className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 focus:outline-none">
              <Home className="h-4 w-4 text-gray-500" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="focus:ring-0 focus-visible:ring-0">
            <Link href="/settings" className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 focus:outline-none">
              <Settings className="h-4 w-4 text-gray-500" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          {user.role === "Admin" && (
            <DropdownMenuItem asChild className="focus:ring-0 focus-visible:ring-0">
              <Link href="/admin" className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 focus:outline-none">
                <Lock className="h-4 w-4 text-gray-500" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 focus:outline-none"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-gray-500" />
            ) : (
              <Moon className="h-4 w-4 text-gray-500" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-100" />
        <div className="p-1">
          <DropdownMenuItem 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-2 py-2 text-red-600 hover:bg-red-50 focus:ring-0 focus-visible:ring-0 focus:outline-none"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
