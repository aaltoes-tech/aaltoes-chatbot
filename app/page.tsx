import "./globals.css";
import WelcomeInput from "../components/Chatbot/welcome_input";
import LeftMenu from "../components/left_menu";
import prisma from "../lib/prisma";
import getSession from "../lib/getSession";
import { MessageSquare } from "lucide-react";

export default async function Page() {

    const session = await getSession();
    const user = session?.user;

    const chats = user ? await prisma.chat.findMany({
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
    }) : [];
   
    // Get user's quota if logged in
    const userQuota = user ? await prisma.user.findUnique({
        where: { id: user.id },
        select: { quota: true }
    }) : null;

    return (
        <main className="flex h-screen items-stretch bg-gray-50 w-full">
            <div className="flex w-full h-full">
                <div className="flex-none h-full flex flex-col bg-gray-100 p-2 overflow-y-auto">
                    <LeftMenu chats={chats} />
                </div>
                <div className="flex-1 h-full flex flex-col bg-white p-10 shadow-lg  ">
                <WelcomeInput />
                    {user && (
                        <div className="max-w-3xl mx-auto w-1/3 mb-6 p-5">
                            <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">
                                        Available quota
                                    </span>
                                </div>
                                <span className="font-medium text-blue-600">
                                    {userQuota?.quota || 0}$
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
