import { streamText, generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import prisma from "../../../lib/prisma";
import getSession from "../../../lib/getSession";
import { MODELS } from "../../../lib/constants";
import { encodingForModel, TiktokenModel } from 'js-tiktoken';

const openaiClient = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    const session = await getSession();
    const user = session?.user;
    const { messages } = await req.json();
    const chatId = req.headers.get('chat_id');
    const model = req.headers.get('model') as string;
    const num_messages = parseInt(req.headers.get('num_messages') || '0');

    const chatHistory = await prisma.message.findMany({
        where: { chat_id: chatId },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { 
            role: true,
            content: true 
        }
    });
   
    const lastMessages = chatHistory.reverse();

    if (num_messages % 5 == 0){
        const response = await generateText({
            model: openaiClient(model),
            prompt: `Generate a very concise chat topic (5 words) based on these messages:\n${lastMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`,
            max_tokens: 15,
            temperature: 0.7
        });
        await prisma.chat.update({
            where: { id: chatId },
            data: { topic: response.text.trim() }
        });
    }

    if (!session || !user) {
        return Response.redirect(
            `${process.env.NEXTAUTH_URL}/auth/signin?callbackUrl=/chat/${chatId}`,
            302
        );
    }

    const user_quota = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            quota: true
        }
    });

    if (user_quota?.quota && user_quota.quota <= 0) {
        return new Response('Quota exceeded', { status: 403 });
    }else{

        const model = req.headers.get('model') as string;
        session.user.model = model;

        if (req.headers.get('reload') == "false"){
            await prisma.message.create({
                data: {
                    role: 'user',
                    content: messages[messages.length-1].content,
                    chat_id: chatId,
                }
            });
        }
        
        const stream = await streamText({
            model: openaiClient(model),
            messages: [...messages],
            temperature: 1,
            async onFinish({finishReason, usage, text}){
                if (chatId && user.id){
                    const encoding = encodingForModel(model as TiktokenModel)
                    const input_quota = encoding.encode(text).length*MODELS[model as keyof typeof MODELS].input_quota
                    const output_quota = encoding.encode(text).length*MODELS[model as keyof typeof MODELS].output_quota

                    await prisma.message.create({
                        data: {
                            role: 'assistant',
                            content: text,
                            chat_id: chatId,
                        }
                    });
                    const updatedUser = await prisma.user.update({
                        where: { id: user.id },
                        data: { quota: (user_quota?.quota || 0) - (input_quota + output_quota)}
                    });
    
                    session.user.quota = updatedUser.quota as number;
                }
            }
        });
        return stream?.toDataStreamResponse();
    }
}