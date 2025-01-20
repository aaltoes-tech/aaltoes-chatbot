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

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[85vh] flex-1 justify-center overflow-y-auto bg-background">
        <div className="w-full max-w-4xl px-4">
          <div className="flex flex-col gap-2">
            {messages.length > 0 &&
              messages.map((m, index) => (
                <div key={index} className="fade-in">
                  {m.role === "user" ? (
                    <div className=" rounded-lg">
                      <UserMessage {...m} />
                    </div>
                  ) : (
                    <div className=" rounded-lg">
                      <BotMessage {...m} createdAt={m.createdAt}/>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="h-[15vh]  bg-card p-4 pb-6 md:pb-8">
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
              className="min-h-[100px] w-full resize-none rounded-lg border bg-background p-4 pr-12 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-lg bg-muted p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground "
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
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
