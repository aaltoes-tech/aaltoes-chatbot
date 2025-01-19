"use client";

import Chatbot from "../../../components/Chatbot/chatbot";
import NavBar from "../../../components/NavBar";

interface PageProps {
  params: { id: string };
}

export default function Page({ params: { id } }: PageProps) {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <NavBar />
        <div className="flex-1 overflow-auto">
          <Chatbot chat_id={id} />
        </div>
      </div>
    </div>
  );
}
