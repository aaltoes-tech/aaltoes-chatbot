"use client"

import "./globals.css";
import WelcomeInput from "../components/Chatbot/welcome_input";
import Quota from "../components/quota";
import NavBar from "../components/NavBar";
import LeftMenu from "../components/left_menu";

export default function Page() {
    return (
        <main className="flex h-screen">
            <div className="flex h-screen">
                <LeftMenu />
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1 overflow-auto">
                        <WelcomeInput />
                        <Quota />
                    </main>
                </div>
            </div>
        </main>

    );
}
