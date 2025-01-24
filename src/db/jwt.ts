import { jwtDecode, JwtPayload } from "jwt-decode";

export function decode(accessToken: string) {
  try {
    return jwtDecode<JwtPayload & { role: string }>(accessToken);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { role: "anon" } as JwtPayload & { role: string };
  }
}
