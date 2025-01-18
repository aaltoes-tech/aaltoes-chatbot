import prisma from "../../../../lib/prisma";
import getSession from "../../../../lib/getSession";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        const user = session?.user;
        const content = req.headers.get('content') as string;
        
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const new_chat = await prisma.chat.create({
            data: {
                user_id: user.id,
                topic: "New chat",
            },
            include: {
                messages: true
            }
        });

        const message = await prisma.message.create({
            data: {
                role: 'user',
                content: content,
                chat_id: new_chat.id
            }
        });

        return new Response(JSON.stringify({ 
            chat_id: new_chat.id, 
            first_message_id: message.id 
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating chat:', error);
        return new Response('Error creating chat', { status: 500 });
    }
}