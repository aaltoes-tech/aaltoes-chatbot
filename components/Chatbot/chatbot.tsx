"use client"

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
}

function Chatbot({ chat_id }: { chat_id: string }) {
    const { data: session } = useSession();
    const [selectedModel, setSelectedModel] = useState(session?.user?.model || 'gpt-4o-mini');
    const [reloadNeeded, setReloadNeeded] = useState(false);
    const messageCountRef = useRef(0);
    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await fetch(`/api/chat/${chat_id}/messages`, {
                    method: 'GET',
                });
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                const filteredMessages = data
                    .filter((m: Message) => m.role && m.content)
                    .filter((m: Message) => ['user', 'system', 'assistant'].includes(m.role));
                setInitialMessages(filteredMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
                notFound();
            }
        }
        fetchMessages();
    }, [chat_id]);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        stop,
        reload,
        error
    } = useChat({
        api: "/api/chat",
        headers: {
            model: selectedModel,
            chat_id: chat_id,
            reload: reloadNeeded ? "true" : "false",
            num_messages: messageCountRef.current.toString()
        },
        experimental_throttle: 50,
        initialMessages,
        onFinish: () => {
            messageCountRef.current = messages.length + 1;
        },
        onError: (error) => {
            const errorMessage = error.message || 'An error occurred';
            toast({
                variant: "destructive",
                title: errorMessage,
            });
        }
    });

    useEffect(() => {
        if (initialMessages[initialMessages.length-1]?.role === "user") {
            setReloadNeeded(true);
        }
    }, [initialMessages]);

    useEffect(() => {
        if (reloadNeeded) {
            reload();
            setReloadNeeded(false);
        }
    }, [reloadNeeded, reload]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (session?.user) {
                handleSubmit();
            } else {
                alert('Please sign in to submit messages.');
            }
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-1 overflow-y-auto h-[85vh] flex justify-center">
                <div className="w-full max-w-4xl px-4">
                    <div className="flex flex-col gap-2">
                        {messages.length > 0 && messages.map((m, index) => (
                            <div key={index} className="fade-in">
                                {m.role === 'user' ? (
                                    <UserMessage {...m} />
                                ) : (
                                    <BotMessage 
                                        {...m} 
                                        isLast={index === messages.length - 1}
                                        createdAt={m.createdAt}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="border-t p-4 pb-6 md:pb-8 h-[15vh]">
                <form onSubmit={handleSubmit} className="relative max-w-5xl mx-auto flex gap-2 items-center">
                    <div className="flex-1 relative">
                        <Textarea
                            value={input}
                            onKeyDown={handleKeyDown}
                            onChange={handleInputChange}
                            placeholder="Type your message here..."
                            className="w-full min-h-[100px] p-4 pr-12 text-base md:text-lg text-gray-800 
                                      placeholder-gray-400 border rounded-lg resize-none bg-gray-50
                                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                      transition-all duration-200"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                className="p-3 text-gray-500 hover:text-red-500 transition-colors
                                         bg-gray-100 hover:bg-gray-200 rounded-lg"
                                title="Stop generating"
                            >
                                <Square className="h-6 w-6" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => reload()}
                                disabled={!messages.length}
                                className="p-3 text-gray-500 hover:text-blue-500 transition-colors
                                         bg-gray-100 hover:bg-gray-200 rounded-lg
                                         disabled:opacity-50 disabled:cursor-not-allowed"
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
