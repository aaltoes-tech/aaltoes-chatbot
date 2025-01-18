import prisma from "../../../../lib/prisma";
import getSession from "../../../../lib/getSession";

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        const chatId = req.headers.get('chat_id') ?? '';

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        await prisma.$transaction(async (tx) => {
            await tx.message.deleteMany({
                where: {
                    chat_id: chatId
                }
            });

            await tx.chat.delete({
                where: {
                    id: chatId,
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