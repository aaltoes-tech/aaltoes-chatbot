import prisma from "../../../lib/prisma";
import Link from "next/link";
import Chatbot from "../../../components/Chatbot/chatbot";
import LeftMenu from "../../../components/left_menu";
import getSession from "../../../lib/getSession";
import { notFound, redirect } from "next/navigation";

type Message = {
    role: "user" | "system" | "assistant";
    content: string;
    id: string;
}

interface PageProps {
  params: { id: string };
}

export default async function Page({ params: { id }}: PageProps) {
  const session = await getSession();
  const user = session?.user;

  const chat = await prisma.chat.findUnique({
    where: {
      id: id
    }
  })

  if (!chat) {
    redirect('/');
  }

  const messages = await prisma.message.findMany({
    where: {
      chat_id: id
    },
    select: {
      role: true,
      content: true,
      id: true
    }
  })

  const chats = await prisma.chat.findMany({
    where: {
        user_id: user.id
    },
    select: {
        id: true,
        topic: true
    },
    orderBy: {
        id: 'desc'
    }
  });

    return (
      <main className="flex h-screen items-stretch bg-gray-50 w-full ">
        <div className="flex w-full h-full">
            <div className="w-1/5 h-full flex flex-col bg-gray-100 p-4 overflow-y-auto">
                <LeftMenu chats={chats} />
            </div>
            <div className="w-4/5 h-full  flex  flex-col bg-white p-4 shadow-lg items-center justify-center">
              <div className="flex flex-col h-[80%] flex-1 w-full overflow-y-auto">
                  <Chatbot init_messages={messages.filter(m => m.role && m.content) as Message[]} chat_id={id}/>
               </div>
            </div>
         </div>
      </main>
    );
}

