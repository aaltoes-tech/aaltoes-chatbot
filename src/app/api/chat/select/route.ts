import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("user_id");

    if (!userId) {
        return new Response(
            JSON.stringify({
                error: "Unauthorized",
                message: "User ID is required",
            }),
            { status: 401 }
        );
    }

    try {
        const sevenDaysAgo = subDays(new Date(), 7);
        await prisma.message.deleteMany({
            where: {
                chat: {
                    user_id: userId,
                    updated_at: {
                        lt: sevenDaysAgo
                    }
                }
            }
        });

        await prisma.chat.deleteMany({
            where: {
                user_id: userId,
                updated_at: {
                    lt: sevenDaysAgo
                }
            }
        });

        // Then fetch remaining chats
        const chats = await prisma.chat.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                updated_at: "desc",
            },
            select: {
                id: true,
                topic: true,
                updated_at: true,
            },
        });

        return new Response(JSON.stringify(chats), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return new Response(
            JSON.stringify({
                error: "Server Error",
                message: "Failed to fetch chats",
            }),
            { status: 500 }
        );
    }
}
