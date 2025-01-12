"use client"
import BotMessage from "./ui/bot-message"
import UserMessage from "./ui/user-message"
import ChatInput from "./ui/chat-input"
import {useState} from "react"
export type Message={
    content : string,
    role : 'user'|'assistant'|'system',
}

function Chatbot() {
    const [userMessage, setUserMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([

    ]);

    return (
        <div className="flex flex-col h-full justify-center w-full">
            <div className="flex flex-col h-[80%] flex-1 w-full overflow-y-auto p-20">
                {messages.length > 0 ? messages.map((m, index) => (
                    m.role === 'user' ? (
                        <UserMessage {...m} key={m.content + index} />
                    ) : m.role === 'assistant' ? (
                        <BotMessage {...m} key={m.content + index} />
                    ) : (
                        <p key={m.content + index}>System: {m.content}</p>
                    )
                )) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <h1 style={{ fontSize: 45 }}>What can I help with?</h1>
                    </div>
                )}
            </div>
            <div className="flex items-center w-full h-[20%] mt-auto p-20">
                <ChatInput />
            </div>
        </div>
    );
}

export default Chatbot;