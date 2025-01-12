import getSession from "@/lib/getSession";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

import { useSession, signIn, signOut } from "next-auth/react"

export const metadata: Metadata = {
  title: "Admin",
};

export default async function Page() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  if(user.active !== true){
    return (
      <main className="flex flex-col items-center gap-6 px-3 py-10">
        <h1 className="text-center text-4xl font-bold">Your account was permanently banned. Contact owner if you think that it is error.</h1>
      </main>
    );
  }
  
  if (user.role !== "Admin"){
    return (
    <main className="mx-auto my-10 p-5">
      <p> You are not authorized to see this page { user.role}</p>
      </main>
    )

  }else{
    const users = await prisma.user.findMany();
  return (
    <main className="mx-auto my-10 p-5">
      <h1 className="text-center text-xl font-bold">Admin Page</h1>
      <p className="text-center">Welcome, admin!</p>

      <div className="flex flex-col w-full mt-4">
        <div className="flex border-b border-gray-300">
          <div className="flex-1 p-2 font-bold text-center">Name</div>
          <div className="flex-1 p-2 font-bold text-center">Email</div>
          <div className="flex-1 p-2 font-bold text-center">Role</div>
          <div className="flex-1 p-2 font-bold text-center">Quota</div>
          <div className="flex-1 p-2 font-bold text-center">Active</div>
          <div className="flex-1 p-2 font-bold text-center">Actions</div>
        </div>
        {users.map((user) => (
          <div key={user.id} className="flex border-b border-gray-300">
            <div className="flex-1 p-2 text-center">{user.name || `User ${user.id}`}</div>
            <div className="flex-1 p-2 text-center">{user.email}</div>
            <div className="flex-1 p-2 text-center">{user.role || "N/A"}</div>
            <div className="flex-1 p-2 text-center">{user.quota || "N/A"}</div>
            <div className="flex-1 p-2 text-center">{user.active ? "Yes" : "No"}</div>
            <div className="flex-1 p-2 text-center">
              <button className="bg-black text-white py-1 px-4 rounded">
                <Link href={`/admin/user/${user.id}`} className="hover:underline text-white">
                  Edit
                </Link>
              </button>
            
            </div>
          </div>
        ))}
      </div>
    </main>
  );
  }
};  
