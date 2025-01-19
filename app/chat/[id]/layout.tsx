import { redirect } from "next/navigation";
import getSession from "../../../lib/getSession";
import prisma from "../../../lib/prisma";

export default async function ChatLayout({
    children,
    params: { id }
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const session = await getSession();
    
    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/chat/" + id);
    }

    const chat = await prisma.chat.findUnique({
        where: { id },
        select: { user_id: true }
    });

    if (!chat || chat.user_id !== session.user.id) {
        redirect("/");
    }

    return children;
} 