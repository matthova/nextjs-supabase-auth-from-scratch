import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { User } from "@supabase/supabase-js";
import { SUPABASE_USER_OBJECT_HEADER } from "@/constants";
import { userParser } from "@/lib/zod";

export async function createSupabaseClient() {
  const cookieStore = await cookies();

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  return client;
}

export async function getUserObject(): Promise<User | null> {
  const requestHeaders = await headers();
  const userString =
    requestHeaders.get(SUPABASE_USER_OBJECT_HEADER)?.toString() ?? "";
  if (userString === "") return null;
  const user = userParser.parse(JSON.parse(userString));
  return user;
}
