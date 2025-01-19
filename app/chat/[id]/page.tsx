"use client"

import prisma from "../../../lib/prisma";
import Link from "next/link";
import Chatbot from "../../../components/Chatbot/chatbot";
import LeftMenu from "../../../components/left_menu";
import getSession from "../../../lib/getSession";
import { notFound, redirect } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../../../components/ui/button";

type Message = {
    role: "user" | "system" | "assistant";
    content: string;
    id: string;
}
interface Chat {
  id: string;
  topic: string;
}

interface PageProps {
  params: { id: string };
}

export default function Page({ params: { id }}: PageProps) {
    return (
        <div className="h-full">
            <Chatbot chat_id={id}/>
        </div>
    );
}

