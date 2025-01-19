"use client";

import BotMessage from "./ui/bot-message";
import UserMessage from "./ui/user-message";
import { Textarea } from "../ui/textarea";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useChat } from "ai/react";
import { ChevronDown, Send, Square, RotateCw } from "lucide-react";
import { toast } from "../ui/use-toast";
import { notFound } from "next/navigation";

type Message = {
  role: "user" | "system" | "assistant";
  content: string;
  id: string;
};

function Chatbot({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: Message[];
}) {
  const { data: session } = useSession();
  const [selectedModel, setSelectedModel] = useState(
    session?.user?.model || "gpt-4o-mini",
  );
  const messageCountRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
  } = useChat({
    id: chatId,
    api: "/api/chat",
    headers: {
      model: selectedModel,
      num_messages: messageCountRef.current.toString(),
    },
    body: {
      id: chatId,
    },
    initialMessages: initialMessages,
    experimental_throttle: 50,
    onFinish: () => {
      messageCountRef.current = messages.length + 1;
    },
    onError: (error) => {
      const errorMessage = error.message || "An error occurred";
      toast({
        variant: "destructive",
        title: errorMessage,
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (session?.user) {
        handleSubmit();
      } else {
        alert("Please sign in to submit messages.");
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[85vh] flex-1 justify-center overflow-y-auto">
        <div className="w-full max-w-4xl px-4">
          <div className="flex flex-col gap-2">
            {messages.length > 0 &&
              messages.map((m, index) => (
                <div key={index} className="fade-in">
                  {m.role === "user" ? (
                    <UserMessage {...m} />
                  ) : (
                    <BotMessage {...m} createdAt={m.createdAt} />
                  )}
                </div>
              ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="h-[15vh] border-t p-4 pb-6 md:pb-8">
        <form
          onSubmit={handleSubmit}
          className="relative mx-auto flex max-w-5xl items-center gap-2"
        >
          <div className="relative flex-1">
            <Textarea
              value={input}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="min-h-[100px] w-full resize-none rounded-lg border bg-muted p-4 pr-12 text-base text-foreground placeholder-muted-foreground transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-lg"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground transition-colors hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              title="Send message"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          <div className="flex gap-2">
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="rounded-lg bg-muted p-3 text-gray-500 transition-colors hover:bg-gray-200 hover:text-red-500"
                title="Stop generating"
              >
                <Square className="h-6 w-6" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => reload()}
                disabled={!messages.length}
                className="rounded-lg bg-muted p-3 text-gray-500 transition-colors hover:bg-gray-200 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                title="Regenerate response"
              >
                <RotateCw className="h-6 w-6" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
