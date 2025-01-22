"use server";

import { auth } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { UpdateAdminValues, updateAdminSchema } from "../../../../lib/validation";
import { revalidatePath } from "next/cache";



export async function updateProfile(values: UpdateAdminValues) {
  const session = await auth();


  if (session?.user?.role !== "Admin") {
    throw Error("Unauthorized");
  }

  const { quota, role, id } = updateAdminSchema.parse(values);

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      quota,
      role,
    },
  });

  revalidatePath("/");
}
