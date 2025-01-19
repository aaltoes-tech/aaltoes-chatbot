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

    if (!session || !user) {
        return new Response(JSON.stringify({
            error: 'Unauthorized',
            message: 'You must be signed in to use the chat'
        }), { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { messages } = await req.json();
        const chatId = req.headers.get('chat_id');
        const model = req.headers.get('model') as string;
        const num_messages = parseInt(req.headers.get('num_messages') || '0');

        if (!chatId) {
            return new Response(JSON.stringify({
                error: 'Missing Chat ID',
                message: 'Chat ID is required'
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify chat belongs to user
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { user_id: true }
        });

        if (!chat || chat.user_id !== user.id) {
            return new Response(JSON.stringify({
                error: 'Unauthorized',
                message: 'You do not have access to this chat'
            }), { 
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user_quota = await prisma.user.findUnique({
            where: { id: user.id },
            select: { quota: true }
        });

        if (user_quota?.quota && user_quota.quota <= 0) {
            return new Response(JSON.stringify({
                error: 'Quota Exceeded',
                message: 'Your message quota has been exceeded. Please contact admin to increase your quota.'
            }), { 
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            await prisma.message.create({
                data: {
                    role: 'user',
                    content: messages[messages.length-1].content,
                    chat_id: chatId,
                }
            });

            if (num_messages % 5 === 0) {
                const chatHistory = await prisma.message.findMany({
                    where: { chat_id: chatId },
                    orderBy: { created_at: 'desc' },
                    take: 5,
                    select: { role: true, content: true }
                });

                const response = await generateText({
                    model: openaiClient(model),
                    prompt: `Generate a very concise chat topic (5 words) based on these messages:\n${chatHistory.reverse().map(m => `${m.role}: ${m.content}`).join('\n')}`,
                    maxTokens: 15,
                    temperature: 0.7
                });

                await prisma.chat.update({
                    where: { id: chatId },
                    data: { topic: response.text.trim() }
                });
            }

            const stream = await streamText({
                model: openaiClient(model),
                messages: [...messages],
                temperature: 0.7,
                frequencyPenalty: 0.5,
                presencePenalty: 0.5,
          
                async onFinish({finishReason, usage, text}) {
                    if (chatId && user.id) {
                        const encoding = encodingForModel(model as TiktokenModel);
                        const input_quota = encoding.encode(text).length * MODELS[model as keyof typeof MODELS].input_quota;
                        const output_quota = encoding.encode(text).length * MODELS[model as keyof typeof MODELS].output_quota;

                        await prisma.message.create({
                            data: {
                                role: 'assistant',
                                content: text,
                                chat_id: chatId,
                            }
                        });

                        await prisma.chat.update({
                            where: { id: chatId },
                            data: {   updated_at : new Date() }
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

        } catch (error: any) {
            console.error('OpenAI API Error:', error);
            return new Response(JSON.stringify({
                error: 'API Error',
                message: error.message || 'Failed to generate response'
            }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error: any) {
        console.error('Server Error:', error);
        return new Response(JSON.stringify({
            error: 'Server Error',
            message: error.message || 'An unexpected error occurred'
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}