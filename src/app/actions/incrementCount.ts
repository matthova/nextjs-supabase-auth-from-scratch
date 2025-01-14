"use server";

import { incrementCountForUser } from "@/db/queries";
import { revalidatePath } from "next/cache";

export async function incrementCount({
  userId,
  fail,
}: {
  userId: string;
  fail: boolean;
}) {
  let didError = false;
  try {
    if (fail) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("ope");
        }, 1000);
      });
    }

    await incrementCountForUser(userId);
  } catch (ex) {
    console.log("Increment failed", ex);
    didError = true;
  } finally {
    revalidatePath("/");
  }

  if (didError) {
    throw new Error("Increment failed");
  }
}
