import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                chat_id: params.id
            },
            select: {
                role: true,
                content: true,
                id: true
            },
            orderBy: {
                created_at: 'asc'
            }
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.error('Error fetching messages:', error);
        return new Response('Error fetching messages', { status: 500 });
    }
} 