import { SUPABASE_USER_OBJECT_HEADER } from "@/constants";
import { encrypt } from "@/lib/encryptDecrypt";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const beforeUser = performance.now();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const afterUser = performance.now();
  console.log("Time to get user:", afterUser - beforeUser);

  supabaseResponse.headers.delete(SUPABASE_USER_OBJECT_HEADER);
  if (user != null) {
    const userString = JSON.stringify(user);
    const encryptedUserString = await encrypt(userString);

    supabaseResponse.headers.set(
      SUPABASE_USER_OBJECT_HEADER,
      encryptedUserString
    );
  }

  return supabaseResponse;
}
