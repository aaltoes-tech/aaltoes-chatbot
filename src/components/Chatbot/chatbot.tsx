"use client";

import BotMessage from "./ui/bot-message";
import UserMessage from "./ui/user-message";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useChat } from "ai/react";
import { ChevronDown} from "@geist-ui/icons";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { InputComputer } from "./ui/input-computer";
import { InputMobile } from "./ui/input-mobile";

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

  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Track user scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // Check if the user is scrolling away from the bottom
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
        setIsUserScrolling(!isAtBottom);
      }
    };

    const container = chatContainerRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Handle automatic scrolling
  useEffect(() => {
    if (!isUserScrolling && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsUserScrolling(false);
    }
  }, [messages, isUserScrolling]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading) {
      return;
    }
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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handlePreInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isLoading) {
      handleInputChange(e);
    }
  };

  return (
    
    <div className="flex h-full w-full flex-col">
      {isUserScrolling && (
        <button
          onClick={scrollToBottom}
          className={cn(
            "fixed left-[350px] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
            "rounded-full bg-accent/80 p-2 text-accent-foreground shadow-md",
            "transition-all duration-200 hover:bg-accent",
            "animate-in fade-in-0 zoom-in-90",
            "hover:scale-105 active:scale-95 opacity-50 hover:opacity-100",
            isMobile && "left-[20px]"
          )}
          title="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}
      <div className={cn(
        "flex justify-center overflow-y-auto bg-background relative",
        isMobile ? "h-[calc(100vh-200px)]" : "h-[85%] flex-1"
      )} ref={chatContainerRef}>
        <div className={cn(
          "w-full px-4",
          !isMobile && "max-w-4xl"
        )}>
          <div className="flex flex-col gap-2">
            {messages.length > 0 &&
              messages.map((m, index) => (
                <div key={index} className="animate-in fade-in-0 duration-700 ease-out">
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
        isMobile ? "fixed bottom-[15px] left-0 right-0 " : "h-[15% p-4 pb-6 md:pb-8"
      )}>
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative flex items-center gap-2",
            isMobile ? "mx-2" : "mx-auto max-w-5xl"
          )}
        >
          
          {isMobile ? (
            <InputMobile
              input={input}
              isLoading={isLoading}
              handleKeyDown={handleKeyDown}
              handleInputChange={handlePreInputChange}
              stop={stop}
              reload={reload}
              messages={messages}
            />
          ) : (
            <InputComputer
              input={input}
              isLoading={isLoading}
              handleKeyDown={handleKeyDown}
              handleInputChange={handlePreInputChange}
              handleSubmit={handleSubmit}
              stop={stop}
              reload={reload}
              messages={messages}
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default Chatbot;

