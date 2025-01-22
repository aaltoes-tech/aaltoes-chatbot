import prisma from "@/lib/prisma";
import {
  ChatMessages,
  ChatInput,
  ScrollableChatMessages,
} from "../../../components/Chatbot/chatbot";
import NavBar from "@/components/NavBar";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params: { id } }: PageProps) {
  const initialMessages = await prisma.message.findMany({
    where: { chat_id: id },
    select: { role: true, content: true, id: true },
  });

  const session = await getSession();
  const user = session?.user;

  if (!user?.active && session) {
    redirect("/");
  }


  return (
    <>
      <ScrollableChatMessages
        slotBefore={<NavBar />}
        messagesClassName="pt-4 pb-[10rem]"
        className="h-svh"
        chatId={id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={id} initialMessages={initialMessages} />
    </>
  );
}
