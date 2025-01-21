"use client";

import "./globals.css";
import WelcomeInput from "../components/Chatbot/welcome_input";
import NavBar from "@/components/NavBar";

export default function IndexPage() {
  return (
    <>
      <NavBar />
      <div className="mt-32 flex flex-col items-center">
        <WelcomeInput />
      </div>
    </>
  );
}
