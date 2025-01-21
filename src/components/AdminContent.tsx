"use client"

import { useState } from "react";
import Link from "next/link";
import NavBar from "./NavBar";
import {  Users, Search, ChevronRight } from '@geist-ui/icons'
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
  quota: number | null;
}

export default function AdminContent({ initialUsers }: { initialUsers: User[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = initialUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 my-6">
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 md:p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">User Management</h1>
            </div>
            
            <div className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn("w-full resize-none rounded-lg border bg-background text-base text-foreground",
                    "placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "py-3.5 px-8 pr-12",
                    "shadow-sm transition-shadow duration-200",
                    "focus:shadow-md")}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {filteredUsers.map((user) => (
              <Link 
                key={user.id}
                href={`/admin/user/${user.id}`}
                className="block border-b border-border last:border-0"
              >
                <div className="p-4 hover:bg-accent">
                  <div className="flex items-center gap-3">
                    {user.image && (
                      <img src={user.image} alt="" className="w-10 h-10 rounded-full" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{user.name || 'No name'}</div>
                      <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {user.role || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Quota: ${user.quota || 0}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quota</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-accent">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.image && (
                          <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                        )}
                        <div className="text-sm font-medium text-foreground">{user.name || 'No name'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      ${user.quota || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/user/${user.id}`}
                        className="text-primary hover:text-primary/80 flex items-center justify-end gap-1"
                      >
                        Edit
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}