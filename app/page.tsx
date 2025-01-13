import "./globals.css";
import WelcomeInput from "../components/Chatbot/welcome_input";

import LeftMenu from "../components/left_menu";

export default async function Page() {

  return (
    <main className="flex h-screen items-stretch bg-gray-50 w-full ">
      <div className="flex w-full h-full">
        <div className="w-1/5 h-full flex flex-col bg-gray-100 p-4 overflow-y-auto"> {/* Adjusted width to 20% */}
         <LeftMenu />
        </div>
        <div className="w-4/5 h-full  flex  flex-col bg-white p-4 shadow-lg items-center justify-center"> {/* Adjusted width to 80% and added some padding */}
          <WelcomeInput />
        </div>
      </div>
    </main>
  );
};
