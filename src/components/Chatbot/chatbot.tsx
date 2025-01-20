"use client";

import BotMessage from "./ui/bot-message";
import UserMessage from "./ui/user-message";
import { Textarea } from "../ui/textarea";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useChat } from "ai/react";
import { ChevronDown, Send, Square, RotateCw } from "lucide-react";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { SelectModel } from "./select-model";

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
  const messageCountRef = useRef(0);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (session?.user) {
        handleSubmit(event as any);
      } else {
        signIn();
      }
    }
  };
  const { open, openMobile, isMobile } = useSidebar();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className={cn(
        "flex justify-center overflow-y-auto bg-background",
        isMobile ? "h-[calc(100vh-180px)]" : "h-[85%] flex-1"
      )}>
        <div className={cn(
          "w-full px-4",
          !isMobile && "max-w-4xl"
        )}>
          <div className="flex flex-col gap-2">
            {messages.length > 0 &&
              messages.map((m, index) => (
                <div key={index} className="fade-in">
                  {m.role === "user" ? (
                    <div className="rounded-lg">
                      <UserMessage {...m} />
                    </div>
                  ) : (
                    <div className="rounded-lg">
                      <BotMessage {...m} createdAt={m.createdAt}/>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className={cn(
        "bg-card",
        isMobile ? "fixed bottom-0 left-0 right-0 p-2" : "h-[15% p-4 pb-6 md:pb-8"
      )}>
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative flex items-center gap-2",
            isMobile ? "mx-2" : "mx-auto max-w-5xl"
          )}
        >
          {isMobile && (
            <div className="absolute -top-10 right-0 z-10">
              <SelectModel />
            </div>
          )}
          <div className="relative flex-1">
            <Textarea
              value={input}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className={cn(
                "w-full resize-none rounded-lg border bg-background p-4 pr-12 text-base text-foreground",
                "placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isMobile ? "min-h-[80px]" : "min-h-[100px]"
              )}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              title="Send message"
            >
              <Send className={cn("h-6 w-6", isMobile && "h-5 w-5")} />
            </button>
          </div>
          {!isMobile && (
            <div className="flex gap-2">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="rounded-lg bg-muted p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  title="Stop generating"
                >
                  <Square className="h-6 w-6" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => reload()}
                  disabled={!messages.length}
                  className="rounded-lg bg-muted p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  title="Regenerate response"
                >
                  <RotateCw className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Chatbot;

