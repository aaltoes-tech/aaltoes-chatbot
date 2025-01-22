import {Shield } from "lucide-react";
import prisma from "../../lib/prisma";
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
      <main className="min-h-screen bg-background py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-card rounded-xl shadow-sm border p-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Access Denied</h1>
            </div>
            <p className="mt-4 text-muted-foreground">
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
