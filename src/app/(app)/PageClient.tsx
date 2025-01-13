"use client";

import { userSelectors } from "@/lib/slices/userSlice";
import { useAppSelector } from "@/lib/storeHooks";
import { incrementCount } from "../actions/incrementCount";

interface PageClientProps {
  count: number | null;
}
export function PageClient({ count }: PageClientProps) {
  const user = useAppSelector((state) => userSelectors.getUser(state));
  return (
    <div>
      <h1>Hello, world!</h1>
      <div>{JSON.stringify(user)}</div>
      <div>Count: {count ?? 0}</div>
      <form action={incrementCount}>
        <input type="hidden" name="userId" value={user?.id} />
        <button type="submit">Increment count</button>
      </form>
    </div>
  );
}
