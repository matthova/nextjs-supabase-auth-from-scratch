import { SUPABASE_USER_OBJECT_HEADER } from "@/constants";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import * as jose from "jose";

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
    const secret = jose.base64url.decode(process.env.HEADER_ENCODE_SECRET!);
    const jwt = await new jose.EncryptJWT({ ...user })
      .setIssuedAt()
      .setExpirationTime("10s")
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
      .encrypt(secret);

    supabaseResponse.headers.set(SUPABASE_USER_OBJECT_HEADER, jwt);
  }

  return supabaseResponse;
}
