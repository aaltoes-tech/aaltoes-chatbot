import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getSession from "@/lib/getSession";


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { active } = await req.json();
    const userId = params.id;

    // If deactivating user, delete all their sessions
    if (!active) {
      await prisma.session.deleteMany({
        where: { userId }
      });
    }

    // Delete all messages from user's chats
    await prisma.message.deleteMany({
      where: {
        chat: {
          user_id: userId
        }
      }
    });

    // Delete all user's chats
    await prisma.chat.deleteMany({
      where: {
        user_id: userId
      }
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        active,
        ...(active === false && { quota: 0 }),
        role: "User"
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_ACTIVE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
