import prisma from "@/lib/prisma";
import Chatbot from "../../../components/Chatbot/chatbot";
import NavBar from "../../../components/NavBar";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params: { id } }: PageProps) {
  const initialMessages = await prisma.message.findMany({
    where: { chat_id: id },
    select: { role: true, content: true, id: true },
  });

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <NavBar />
        <div className="flex-1 overflow-auto">
          <Chatbot chatId={id} initialMessages={initialMessages} />
        </div>
      </div>
    </div>
  );
}
