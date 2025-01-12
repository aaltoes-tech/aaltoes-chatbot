"use client"

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

import Image  from "next/image";
import { Textarea } from "@/components/ui/textarea"

import Chatbot from "@/components/Chatbot/chatbot"; 

import "./globals.css";

export default function Page() {
  return (
    <main className="flex h-screen items-stretch bg-gray-50 w-full ">
      <div className="flex w-full h-full">
        <div className="w-1/5 h-full flex flex-col bg-gray-100 p-4 overflow-y-auto"> {/* Adjusted width to 20% */}
          <h1>Menu</h1>
          
        </div>
        <div className="w-4/5 h-full justify-center flex items-center flex-col bg-white p-4 shadow-lg"> {/* Adjusted width to 80% and added some padding */}
          <Chatbot />
        </div>
      </div>
    </main>
  );
};
