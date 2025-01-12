import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useChat} from "ai/react"
import {ChatAI} from '@/_actions/ChatAI'



export default function ChatInput() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: ChatAI
    });

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center justify-center bg-background shadow-sm w-full">
            <Textarea
                value={input}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="flex required rounded-md border bg-gray-100 mg-3 w-full text-sm text-black resize-none"
            />
        </form>
    );
}