"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Search, ChevronRight } from "@geist-ui/icons";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Switch } from "@/components/ui/switch"
import { useToast } from "./ui/use-toast";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
  quota: number | null;
  active: boolean | true;
}

export default function AdminContent({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { data: session } = useSession();

  const toggleUserActive = async (username: string, userId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/user/${userId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (!response.ok) {
        throw new Error();
      } else {
        toast({ description: `Account of ${username} was ${active ? ' activated' : ' deactivated'} successfully` });
      }
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to update user status" });
    }
  };

  const filteredUsers = initialUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mx-auto my-6 max-w-7xl p-4">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4 md:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              User Management
            </h1>
          </div>

          <div className="w-full">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full resize-none rounded-lg border bg-background text-base text-foreground",
                  "placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "px-8 py-3.5 pr-12",
                  "shadow-sm transition-shadow duration-200",
                  "focus:shadow-md",
                )}
              />
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground"
                size={16}
              />
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
                    <img
                      src={user.image}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">
                      {user.name || "No name"}
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {user.role || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Quota: ${user.quota || 0}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Quota
                </th>
                <th className="px-6 py-3 text-right text-xs text-center font-medium uppercase tracking-wider text-muted-foreground">
                  Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-card">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-accent">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.image && (
                        <img
                          src={user.image}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <div className="text-sm font-medium text-foreground">
                        {user.name || "No name"}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-primary/10 px-2 text-xs font-semibold leading-5 text-primary">
                      {user.role || "User"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    ${user.quota?.toFixed(5) || 0}
                  </td>
                  <td className="whitespace-nowrap items-center px-6 py-4 text-sm text-muted-foreground">
                    <Switch 
                      disabled={user.id === session?.user?.id}
                      defaultChecked={user.active}
                      onCheckedChange={(checked) => toggleUserActive(user.name || "User", user.id, checked)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/user/${user.id}`}
                      className="flex items-center justify-end gap-1 text-primary hover:text-primary/80"
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
  );
}
