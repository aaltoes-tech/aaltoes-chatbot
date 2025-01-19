import prisma from "../../../../lib/prisma";
import getSession from "../../../../lib/getSession";
import { z } from "zod";

const chatSchema = z.object({
    chatId: z.string()
});

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        const body = chatSchema.safeParse(await req.json());
        if (!body.success) {
            return new Response('Invalid chat ID', { status: 400 });
        }

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        await prisma.$transaction(async (tx) => {
            await tx.message.deleteMany({
                where: {
                    chat_id: body.data.chatId
                }
            });

            await tx.chat.delete({
                where: {
                    id: body.data.chatId,
                    user_id: session.user.id
                }
            });
        });

        return new Response('Chat deleted', { status: 200 });
    } catch (error) {
        console.error('Error deleting chat:', error);
        return new Response('Error deleting chat', { status: 500 });
    }
} 