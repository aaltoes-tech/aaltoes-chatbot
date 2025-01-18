"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

export default function WelcomeInput() {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user){
            router.push("/api/auth/signin");
        }else{
            if (!content.trim()) return;
            try {
                const response = await fetch('/api/chat/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'content': content
                    }
                });
                
                if (!response.ok) throw new Error('Failed to create chat');
                
                const { chat_id } = await response.json();
                router.push(`/chat/${chat_id}`);
            } catch (error) {
                console.error('Error creating chat:', error);
            }
        }
        
    };

    return (
        <div className="max-w-3xl mx-auto w-full px-4">
            <div className="relative rounded-xl bg-white shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-blue-50 rounded-full p-3">
                        <MessageSquare className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                    How can I help you today?
                </h1>
                <p className="text-gray-500 text-center mb-6 text-sm">
                    Ask me anything - I'm here to assist with your questions
                </p>
                
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full min-h-[100px] p-4 pr-12 text-gray-800 placeholder-gray-400
                                 border border-gray-200 rounded-lg resize-none bg-gray-50
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition-all duration-200"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="absolute right-3 bottom-3 p-2 rounded-lg
                                 text-gray-400 hover:text-blue-500 hover:bg-blue-50
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-all duration-200"
                        title="Send message"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>

                <div className="mt-4 text-center text-xs text-gray-400">
                    Press Enter to send • Shift + Enter for new line
                </div>
            </div>
        </div>
    );
}
