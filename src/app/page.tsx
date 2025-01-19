"use client";

import "./globals.css";
import WelcomeInput from "../components/Chatbot/welcome_input";
import NavBar from "../components/NavBar";

export default function Page() {
  return (
    <div className="flex flex-col">
      {/* Mobile Menu Button */}
      <NavBar />
      <div className="flex-1 overflow-auto">
        <div className="mt-32 flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-16 px-4">
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                <WelcomeInput />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
