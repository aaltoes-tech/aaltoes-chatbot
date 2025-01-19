import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import getSession from "../../../../../lib/getSession";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const chat = await prisma.chat.findUnique({
        where: { id: params.id },
        select: { user_id: true }
    });

    if (!chat || chat.user_id !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const messages = await prisma.message.findMany({
        where: {
            chat_id: params.id,
        },
        orderBy: {
            created_at: 'asc',
        },
    });

    return NextResponse.json(messages);
} 