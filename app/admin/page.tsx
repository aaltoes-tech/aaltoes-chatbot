import Link from "next/link";
import { Users, Shield, ChevronRight, Search } from "lucide-react";
import prisma from "../../lib/prisma";
import NavBar from "../../components/NavBar";
import getSession from "../../lib/getSession";
import { redirect } from "next/navigation";
import AdminContent from "../../components/AdminContent";

export default async function Page() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  if (user.role !== "Admin") {
    return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 text-red-500">
              <Shield className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Access Denied</h1>
            </div>
            <p className="mt-4 text-gray-600">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return <AdminContent initialUsers={users} />;
}  
