import "./globals.css";
import WelcomeInput from "../components/Chatbot/welcome_input";
import NavBar from "@/components/NavBar";
import { DeactivatedBanner } from "@/components/deactivated-banner";
import getSession from "@/lib/getSession";

export default async function IndexPage() {
  const session = await getSession();
  return (
    <>
      <NavBar />
      <div className="mt-32 flex flex-col items-center">
        {session?.user?.active || !session ? <WelcomeInput /> : <DeactivatedBanner />}

      </div>
    </>
  );
}
