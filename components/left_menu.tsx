
import getSession from "../lib/getSession";
import prisma from "../lib/prisma";
import Link from "next/link";

export default async function LeftMenu() {
    const session = await getSession();
    const user = session?.user;
    

    if (user!==undefined) {
        const chats = await prisma.message.findMany({
            where: {
              user_id: user.id
            },
            select: {
              chat_id: true,
            }
          });
        const chatIds = chats.map(item => item.chat_id);
        const uniqueChatIds = Array.from(new Set(chatIds));

        if (uniqueChatIds) {
            console.log(uniqueChatIds)
            return (
                <>
                <div>Chats history:</div>
            <div className="p-2">
                {uniqueChatIds.map((chat) => (
                    <div key={chat}>
                        <Link href={`/chat/${chat}`} className="hover:underline">
                           {chat}
                        </Link>
                    </div>
                  ))
                }
            </div>
                </>
            
        );
    }
    return (
            <div>No conversations yet</div>
        );
    }
}

