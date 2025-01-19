"use client"

import "./globals.css";
import WelcomeInput from "../components/Chatbot/welcome_input";
import Quota from "../components/quota";
import LeftMenu from "../components/left_menu";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import NavBar from "../components/NavBar";

export default function Page() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu on wider screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(true);
            } else {
                setIsMenuOpen(false);
            }
        };
        
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                {/* Mobile Menu Button */}
                <NavBar onMenuClick={() => setIsMenuOpen(true)} />
                <div className="flex-1 overflow-auto">
                    <div className="flex flex-col items-center mt-32">
                        <div className="w-full max-w-4xl px-4 space-y-16">
                        
                            <div className="flex justify-center">
                            
                                <div className="w-full max-w-3xl">
                                  
                                    <WelcomeInput />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
