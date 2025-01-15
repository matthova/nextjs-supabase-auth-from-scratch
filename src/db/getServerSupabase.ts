import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseClient, User } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;
let user: User | null = null;

async function createSupabaseClient() {
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

export async function getServerSupabase() {
  if (supabase != null) {
    return supabase;
  }

  supabase = await createSupabaseClient();
  return supabase;
}

export async function getUserObject(): Promise<User | null> {
  if (user != null) return user;
  const newUser = await (await getServerSupabase()).auth.getUser();
  user = newUser.data.user;
  return user;
}
