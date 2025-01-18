import prisma from "../../../../lib/prisma";
import getSession from "../../../../lib/getSession";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const chat = await prisma.chat.findUnique({
            where: {
                id: params.id,
                user_id: session.user.id
            },
            select: {
                topic: true
            }
        });

        if (!chat) {
            return new Response('Chat not found', { status: 404 });
        }

        return new Response(JSON.stringify(chat), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching chat:', error);
        return new Response('Error fetching chat', { status: 500 });
    }
} 