"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, MessageSquare, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface Chat {
    id: string;
    topic: string;
}

export default function LeftMenu({chats}: {chats: Chat[]}) {
    const router = useRouter();

    const deleteChat = async (chat_id: string) => {
        try {
            const response = await fetch('/api/chat/delete', {
                method: 'DELETE',
                headers: {
                    'chat_id': chat_id
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete chat');
            router.refresh();
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-2">
                <Link href="/" className="w-full block">
                    <Button 
                        className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white hover:text-white border-0 transition-colors"
                        variant="outline"
                    >
                        <Plus size={16} />
                        New Chat
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                {!chats || chats.length === 0 ? (
                    <div className="text-gray-500 text-center mt-4 p-4">
                        No conversations yet
                    </div>
                ) : (
                    <div className="space-y-2 p-2">
                        {chats.map((chat) => (
                            <div 
                                key={chat.id}
                                className="group flex items-center gap-3 rounded-lg hover:bg-gray-200 p-3 transition-all duration-200 cursor-pointer"
                            >
                                <MessageSquare size={18} className="text-gray-500 flex-shrink-0" />
                                <Link 
                                    href={`/chat/${chat.id}`}
                                    className="flex-1 truncate text-sm text-gray-600 group-hover:text-gray-900"
                                >
                                    {chat.topic || "New Chat"}
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                    title="Delete chat"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


