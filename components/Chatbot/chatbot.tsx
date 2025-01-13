"use client"

import BotMessage from "./ui/bot-message";
import UserMessage from "./ui/user-message";
import { Textarea } from "../ui/textarea";


import { signIn, useSession } from "next-auth/react";

import { useChat } from "@ai-sdk/react";

function Chatbot({init_messages}) {
    const { data: session, status } = useSession();
    const user = session?.user;
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        stop,
        reload,
        error,
        setMessages,
        append
    } = useChat({
        api: "/api/chat"
    });

    if (messages.length == 0){
        setMessages(init_messages);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (user) {
                handleSubmit();
            } else {
                alert('Please sign in to submit messages.');
            }
        }
    };

    return (
        <>
            <div className="flex flex-col h-[80%] flex-1 w-full overflow-y-auto p-20">
                {messages.length > 0 && messages.map((m, index) => (
                    m.role === 'user' ? (
                        
                        <UserMessage {...m} key={index} />
                    ) : (
                        
                        <BotMessage {...m} key={index} />
                    ) 
                ))}
                {isLoading && <div>Loading...</div>}
            </div>
            <div className="flex items-center w-full h-[20%] mt-auto p-20">
                <form onSubmit={handleSubmit} className="flex items-center justify-center bg-background shadow-sm w-full">
                    <Textarea
                        value={input}
                        onKeyDown={handleKeyDown}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                        className="flex required rounded-md border bg-gray-100 mg-3 w-full text-sm text-black resize-none"
                    />
                </form>
            </div>
        </>
    );
}

export default Chatbot;
