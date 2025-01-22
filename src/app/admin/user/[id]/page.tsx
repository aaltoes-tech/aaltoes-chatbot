import prisma from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";
import UpdatePage from "./UpdatePage";
import { redirect } from "next/navigation";
import getSession from "../../../../lib/getSession";


interface PageProps {
  params: { id: string };
}

const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      quota: true,
      role: true,
      active: true,
    },
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

  if (!cur_user?.active && session) {
    redirect("/");
  }

  if (cur_user.role !== "Admin") {
    return (
      <main className="mx-auto my-10 p-5">
        <p> You are not authorized to see this page</p>
      </main>
    );
  } else {
    return (
      <UpdatePage
        user={{
          id: user.id,
          name: user.name ?? "",
          image: user.image ?? "",
          role: user.role ?? "",
          quota: user.quota ?? 0,
          createdAt: user.createdAt,
          active: user.active ?? true,
        }}
      />
    );
  }
}
