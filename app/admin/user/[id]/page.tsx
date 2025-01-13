import prisma from "../../../../lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import UpdatePage from "./UpdatePage";
import { redirect } from "next/navigation";
import Link from "next/link";
import getSession from "../../../../lib/getSession";

interface PageProps {
  params: { id: string };
}

const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true, createdAt: true, quota:true, role: true },
  });
});

export default async function Page({ params: { id } }: PageProps) {

  const session = await getSession();

  const cur_user = session?.user;

  const user = await getUser(id);

  if (!user) notFound();

  if (!cur_user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }


  if (cur_user.role!== "Admin"){
    return (
    <main className="mx-auto my-10 p-5">
      <p> You are not authorized to see this page</p>
      </main>
    )

  }else{
    return (
      <div className="mx-3 my-10 flex flex-col items-center gap-3">
            {user.image && (
              <Image
                src={user.image}
                width={100}
                alt="User profile picture"
                height={100}
                className="rounded-full"
              />
            )}
            <h1 className="text-center text-xl font-bold">
              {user?.name || `User ${id}`}
            </h1>
            <p className="text-muted-foreground">
              User since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <Link href={`/admin`} className="hover:underline">Back</Link>
          
            <UpdatePage user={user} />;
          </div>
      );
  }
}
