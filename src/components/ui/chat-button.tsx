import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, ButtonLink, buttonVariants } from "./button";
import { MessageSquare, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ChatButtonProps {
  id: string;
  topic: string | null;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

const deleteChat = async (chatId: string) => {
  const response = await fetch("/api/chat/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id: chatId }),
  });
  if (!response.ok) throw new Error("Failed to delete chat");
};

export function ChatButton({ id, topic, onDelete, onClick }: ChatButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch("/api/chat/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId: chatId }),
      });
      if (!response.ok) throw new Error("Failed to delete chat");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      onDelete?.(id);
    },
  });

  return (
    <div className={cn("group relative", buttonVariants({ variant: "ghost" }))}>
      <MessageSquare className="!h-4 !w-4 text-muted-foreground" />
      <Link
        href={`/chat/${id}`}
        onClick={onClick}
        className="flex-1 ml-1 truncate text-sm text-gray-600 group-hover:text-gray-900"
      >
        <div className="">{topic || "New Chat"}</div>
        <span className="absolute inset-0"></span>
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteChatMutation.mutate(id);
        }}
        className="z-10 p-1 text-gray-400 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
        title="Delete chat"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export function NewChatButton() {
  return (
    <ButtonLink size="icon" variant="ghost" href="/" className="h-8 w-8">
      <SquarePen aria-hidden className="!h-5 !w-5" />
      <span className="sr-only">New Chat</span>
    </ButtonLink>
  );
}
