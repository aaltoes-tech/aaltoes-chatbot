"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useChat } from "ai/react";
import cuid from "cuid";
import { useQueryClient } from "@tanstack/react-query";

export default function WelcomeInput() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const router = useRouter();

  const [id, setId] = useState(() => cuid());
  useEffect(() => {
    setId(cuid());
  }, []);

  const [selectedModel, setSelectedModel] = useState(
    session?.user?.model || "gpt-4o-mini",
  );

  const queryClient = useQueryClient();

  const { append } = useChat({
    id: id,
    api: "/api/chat",
    headers: {
      model: selectedModel,
      num_messages: "0",
    },
    body: {
      id: id,
    },
    initialMessages: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      router.push("/api/auth/signin");
    } else {
      if (!content.trim()) return;
      try {
        const response = await fetch("/api/chat/create", {
          method: "POST",
          body: JSON.stringify({ chatId: id, content: content }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to create chat");

        append({
          role: "user",
          content: content,
          id: id,
        });
        queryClient.refetchQueries({
          queryKey: ["chats", { userId: session.user.id }],
        });
        router.push(`/chat/${id}`);
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="relative rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-blue-50 p-3">
            <MessageSquare className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-800">
          How can I help you today?
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Ask me anything - I&apos;m here to assist with your questions
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[100px] w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-4 pr-12 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="absolute bottom-3 right-3 rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
          Press Enter to send • Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}
