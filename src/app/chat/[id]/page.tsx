"use client"

import Chatbot from "../../../components/Chatbot/chatbot";
import LeftMenu from "../../../components/left_menu";
import { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar";
import { useSession } from "next-auth/react";

interface PageProps {
    params: { id: string };
}

export default function Page({ params: { id }}: PageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [shouldRerender, setShouldRerender] = useState(false);

    const handleUserMessage = () => {
        setShouldRerender(prev => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(true);
            } else {
                setIsMenuOpen(false);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const session = useSession();
    const user = session?.data?.user;


    return (
        <div className="flex h-screen">
            {/* Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-20 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
            
            {/* Menu */}
            <div className={`
                fixed md:relative inset-y-0 left-0 z-30 
                transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                transition-transform duration-300 ease-in-out
                md:translate-x-0
                w-full md:w-72 bg-gray-100 h-full
            `}>
                <LeftMenu onClose={() => setIsMenuOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <NavBar onMenuClick={() => setIsMenuOpen(true)} />
                <div className="flex-1 overflow-auto">
                    <Chatbot 
                        chat_id={id} 
                        key={shouldRerender ? 'rerender' : 'initial'} 
                    />
                </div>
            </div>
        </div>
    );
}

