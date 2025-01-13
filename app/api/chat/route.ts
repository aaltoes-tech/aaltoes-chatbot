import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai"; // Assuming the correct import is createOpenAI if openai is an API client factory

import prisma from "../../../lib/prisma";
import getSession from "../../../lib/getSession";

// Initialize the OpenAI client with the API key
const openaiClient = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
 

export async function POST(req: Request){

    const session = await getSession();
    const user = session?.user;

    const { messages } = await req.json();
    const url = req.headers.get('referer')
    const parts = url.split("/") ||[""]
    const lastSegment = parts[parts.length - 1];

    if (!user){
        const stream = await streamText({
            model: openaiClient('gpt-4o-mini'), // Directly use the model name as a string if that's what streamText expects
            messages: [ ...messages],
            temperature: 1,
            async onFinish({ text, toolCalls, toolResults, usage, finishReason }){
                await prisma.message.create({
                    data: {
                        'role': 'user',
                        'content': messages[messages.length-1].content,
                        'chat_id': lastSegment,
                        'user_id': user.id
                    }
                })
                await prisma.message.create({
                    data: {
                        'role': 'assistant',
                        'content': text,
                        'chat_id': lastSegment,
                        'user_id': user.id
                    }
                })
        }});
    
        return stream?.toDataStreamResponse();
    }
}
