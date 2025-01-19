import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const user_id = req.headers.get('user_id');

        if (!user_id) {
            return new Response('User ID is required', { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: user_id },
            select: { quota: true }
        });

        return NextResponse.json(user);

    } catch (error) {
        console.error('Error fetching quota:', error);
        return new Response('Error fetching quota', { status: 500 });
    }
} 