import { redirect } from "next/navigation";
import getSession from "../../lib/getSession";
import NavBar from "@/components/NavBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/settings");
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
