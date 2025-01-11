"use client";

import { userSelectors } from "@/lib/slices/userSlice";
import { useAppSelector } from "@/lib/storeHooks";

export default function Page() {
  const user = useAppSelector((state) => userSelectors.getUser(state));
  return (
    <div>
      <h1>Hello, world!</h1>
      <div>{JSON.stringify(user)}</div>
    </div>
  );
}
