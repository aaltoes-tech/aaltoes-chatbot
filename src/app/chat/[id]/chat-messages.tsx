import prisma from "@/lib/prisma";

export async function getMessages(chatId: string) {
  return await prisma.message.findMany({
    where: { chat_id: chatId },
    select: { role: true, content: true, id: true },
  });
} 