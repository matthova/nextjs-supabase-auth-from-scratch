"use client";

import { userSelectors } from "@/lib/slices/userSlice";
import { useAppSelector } from "@/lib/storeHooks";
import { incrementCount } from "../actions/incrementCount";
import React from "react";

interface PageClientProps {
  count: number | null;
}
export function PageClient({ count }: PageClientProps) {
  const user = useAppSelector((state) => userSelectors.getUser(state));
  const [optimisticCount, setOptimisticCount] = React.useOptimistic(
    count ?? 0,
    (state, newVal: number) => newVal
  );

  function handleSubmit() {
    if (user == null) return;
    setOptimisticCount(optimisticCount + 1);
    incrementCount(user.id);
  }

  return (
    <div>
      <h1>Hello, world!</h1>
      <div>{JSON.stringify(user)}</div>
      <div>Count: {optimisticCount}</div>
      <form action={handleSubmit}>
        <input type="hidden" name="userId" value={user?.id} />
        <button type="submit">Increment count</button>
      </form>
    </div>
  );
}
