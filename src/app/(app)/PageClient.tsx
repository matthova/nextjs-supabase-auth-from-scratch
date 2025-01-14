"use client";

import { userSelectors } from "@/lib/slices/userSlice";
import { useAppSelector } from "@/lib/storeHooks";
import { incrementCount } from "../actions/incrementCount";
import React from "react";

interface PageClientProps {
  count: number | null;
}
export function PageClient({ count }: PageClientProps) {
  const [error, setError] = React.useState<string | null>(null);
  const user = useAppSelector((state) => userSelectors.getUser(state));
  const [optimisticCount, setOptimisticCount] = React.useOptimistic(
    count ?? 0,
    (state, newVal: number) => newVal
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (user == null) return;
    React.startTransition(() => {
      setOptimisticCount(optimisticCount + 1);
    });
    incrementCount(user.id).catch(() => {
      React.startTransition(() => {
        setOptimisticCount(optimisticCount);
      });
      setError("Error incrementing count");
    });
  }

  return (
    <div>
      <h1>Hello, world!</h1>
      <div>Count: {optimisticCount}</div>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="px-2 py-1 border border-solid border-foreground rounded-xl"
        >
          Increment count
        </button>
      </form>
      {error == null ? null : <div className="text-red-500">{error}</div>}
      <br />
      <h2>User Info</h2>
      <div>
        {Object.entries(user ?? {}).map(([key, value]) => (
          <div key={key}>
            {key}: {JSON.stringify(value)}
          </div>
        ))}
      </div>
    </div>
  );
}
