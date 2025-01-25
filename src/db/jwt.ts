import * as jose from "jose";

/** Decode the jwt and apply a fallback role of "anon" */
export function decodeWithRole(
  accessToken: string
): jose.JWTPayload & { role: string } {
  try {
    return jose.decodeJwt<{ role: string }>(accessToken);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { role: "anon" };
  }
}
