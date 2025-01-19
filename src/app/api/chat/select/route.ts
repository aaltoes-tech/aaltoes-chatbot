import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const user_id = req.headers.get('user_id');

        if (!user_id) {
            return new Response('User ID is required', { status: 400 });
        }

        const chats = await prisma.chat.findMany({
            where: {
                user_id: user_id
            },
            select: {
                id: true,
                topic: true,
                updated_at: true
            },
            orderBy: {
                updated_at: 'desc'
            }
        });

        return NextResponse.json(chats);

    } catch (error) {
        console.error('Error fetching chats:', error);
        return new Response('Error fetching chats', { status: 500 });
    }
}
