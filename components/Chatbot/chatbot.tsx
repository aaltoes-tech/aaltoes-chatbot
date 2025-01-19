"use client"

import BotMessage from "./ui/bot-message";
import UserMessage from "./ui/user-message";
import { Textarea } from "../ui/textarea";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useChat } from "ai/react";
import { ChevronDown, Send } from "lucide-react";
import { toast } from "../ui/use-toast";

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
                toast({
                    variant: "destructive",
                    title: "Failed to load messages"
                });
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4 h-4/5">
                {messages.length > 0 && messages.map((m, index) => (
                    <div key={index} className="fade-in">
                        {m.role === 'user' ? (
                            <UserMessage {...m} />
                        ) : (
                            <BotMessage {...m} />
                        )}
                    </div>
                ))}
            </div>

            <div className="border-t p-4 pb-6 md:pb-8 h-1/5">
                <form onSubmit={handleSubmit} className="relative max-w-5xl mx-auto ">
                    <Textarea
                        value={input}
                        onKeyDown={handleKeyDown}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                        className="w-full min-h-[100px] p-4 pr-12 text-gray-800 placeholder-gray-400
                                 border rounded-lg resize-none bg-gray-50
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition-all duration-200"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-3 bottom-3 p-2 text-gray-500 hover:text-blue-500 
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chatbot;
