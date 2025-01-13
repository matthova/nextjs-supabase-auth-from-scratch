"use server";

import { incrementCountForUser } from "@/db/queries";
import { revalidatePath } from "next/cache";

export async function incrementCount(formData: FormData) {
  const userId = formData.get("userId")?.toString() ?? "";
  incrementCountForUser(userId);
  revalidatePath("/");
}
