"use server";

import { revalidatePath } from "next/cache";

export async function update({ user }: { user: { quota: number } }) {
  revalidatePath("/");
} 