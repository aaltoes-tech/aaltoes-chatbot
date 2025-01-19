"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, MessageSquare, Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Chat {
    id: string;
    topic: string | null;
}

export default function LeftMenu() {
    const router = useRouter();
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        async function fetchChats() {
            if (session?.user?.id) {
                try {
                    const response = await fetch('/api/chat/select', {
                        method: 'GET',
                        headers: {
                            'user_id': session.user.id
                        }
                    });
                    if (!response.ok) throw new Error('Failed to fetch chats');
                    const data = await response.json();
                    setChats(data);
                } catch (error) {
                    console.error('Error fetching chats:', error);
                }
            }
        }
        fetchChats();
    }, [session?.user?.id]);

    const deleteChat = async (chat_id: string) => {
        try {
            const response = await fetch('/api/chat/delete', {
                method: 'DELETE',
                headers: {
                    'chat_id': chat_id
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete chat');
            setChats(chats.filter(chat => chat.id !== chat_id));
            router.refresh();
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const filteredChats = chats.filter(chat => 
        chat.topic?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <div className="p-2">
                <Link href="/" className="w-full block">
                    <Button 
                        className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white hover:text-white border-0 transition-colors"
                    >
                        <Plus size={16} />
                        New Chat
                    </Button>
                </Link>
            </div>

            <div className="px-2 mt-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 pl-9 bg-gray-50 border border-gray-200 
                                 rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={10} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {!filteredChats || filteredChats.length === 0 ? (
                    <div className="text-gray-500 text-center mt-4 p-4">
                        {searchTerm ? "No matching chats found" : "No conversations yet"}
                    </div>
                ) : (
                    <div className="space-y-2 p-2">
                        {filteredChats.map((chat) => (
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


