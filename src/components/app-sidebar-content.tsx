"use client";

import { SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { ChatButton } from "./ui/chat-button";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const chatSchema = z.object({
  id: z.string(),
  topic: z.string().nullable(),
});

const fetchChats = async ({ userId }: { userId: string }) => {
  const response = await fetch("/api/chat/select", {
    method: "GET",
    headers: {
      user_id: userId,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch chats");
  const chats = z.array(chatSchema).safeParse(await response.json());
  if (!chats.success) {
    console.error(chats.error.errors);
    return [];
  }
  console.log(chats.data);

  return chats.data;
};

export function AppSidebarContent() {
  const { data: session } = useSession();

  return (
    <SidebarContent>
      {session && session.user.id && <ChatsList userId={session.user.id} />}
      <SidebarGroup />
    </SidebarContent>
  );
}

const ChatsList = ({ userId }: { userId: string }) => {
  const { data: chats, status } = useQuery({
    queryKey: ["chats", { userId: userId }],
    queryFn: () => fetchChats({ userId: userId }),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(chats ?? []);

  useEffect(() => {
    setFilteredChats(
      chats?.filter((chat) =>
        chat.topic?.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ?? [],
    );
  }, [chats, searchTerm]);

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error loading chats</p>;
  }

  return (
    <SidebarGroup>
      <div className="relative mb-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search chats"
          className="pl-11"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 transform text-muted-foreground h-4 w-4"
        />
      </div>
      {filteredChats.map((chat) => (
        <ChatButton key={chat.id} id={chat.id} topic={chat.topic} />
      ))}
    </SidebarGroup>
  );
};
