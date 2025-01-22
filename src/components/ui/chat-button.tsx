import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, ButtonLink, buttonVariants } from "./button";
import * as Icon from '@geist-ui/icons'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar";

interface ChatButtonProps {
  id: string;
  topic: string | null;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  isMobile?: boolean;
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

export function ChatButton({ id, topic, onDelete, onClick, isMobile = false }: ChatButtonProps) {
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
    <div className={cn("group relative flex items-center w-full", buttonVariants({ variant: "ghost" }))}>
      <Icon.MessageCircle className="!h-4 !w-4 shrink-0 text-muted-foreground" />
      <Link
        href={`/chat/${id}`}
        onClick={onClick}
        className="flex-1 ml-1 text-sm text-muted-foreground group-hover:text-foreground truncate ..."
        title={topic ?? "New Chat"}
      >
        <div className="truncate ">{topic || "New Chat"}</div>
        <span className="absolute inset-0"></span>
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteChatMutation.mutate(id);
        }}
        className="z-10 p-1 shrink-0 text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
        title="Delete chat"
      >
        <Icon.Trash2 size={16} />
      </button>
    </div>
  );
}

export function NewChatButton() {
  const { setOpenMobile } = useSidebar();

  return (
    <ButtonLink 
      title="Create New Chat" 
      size="icon" 
      variant="ghost" 
      href="/" 
      className="h-8 w-8"
      onClick={() => setOpenMobile(false)}
    >
      <Icon.PlusSquare aria-hidden className="!h-5 !w-5 text-muted-foreground hover:text-foreground" />
      <span className="sr-only">New Chat</span>
    </ButtonLink>
  );
}
