import { redirect } from "next/navigation";
import getSession from "../../lib/getSession";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    
    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    if (session.user.role !== 'Admin') {
        redirect("/");
    }

    return (
        <div className="min-h-screen w-full bg-gray-100">
            {children}
        </div>
    );
} 