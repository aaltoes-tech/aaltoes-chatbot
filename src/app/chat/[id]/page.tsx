import prisma from "@/lib/prisma";
import {
  ChatMessages,
  ChatInput,
  ScrollableChatMessages,
} from "../../../components/Chatbot/chatbot";
import NavBar from "@/components/NavBar";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params: { id } }: PageProps) {
  const initialMessages = await prisma.message.findMany({
    where: { chat_id: id },
    select: { role: true, content: true, id: true },
  });

  return (
    <>
      <ScrollableChatMessages
        slotBefore={<NavBar />}
        messagesClassName="pt-4 pb-[25%] sm:pb-[15%]"
        chatId={id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={id} initialMessages={initialMessages} />
    </>
  );
}
