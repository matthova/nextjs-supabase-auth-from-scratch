"use client";

import { userSelectors } from "@/lib/slices/userSlice";
import { useAppSelector } from "@/lib/storeHooks";
import { incrementCount } from "../actions/incrementCount";
import React from "react";
import Link from "next/link";

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

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    { fail }: { fail: boolean } = { fail: false }
  ) {
    e.preventDefault();
    setError(null);
    if (user == null) return;
    React.startTransition(() => {
      setOptimisticCount(optimisticCount + 1);
    });
    incrementCount({ userId: user.id, fail }).catch(() => {
      React.startTransition(() => {
        setOptimisticCount(optimisticCount);
      });
      setError("Error incrementing count");
    });
  }

  return (
    <div className="flex flex-col gap-2">
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
      <form onSubmit={(e) => handleSubmit(e, { fail: true })}>
        <button
          type="submit"
          className="px-2 py-1 border border-solid border-foreground rounded-xl"
        >
          Increment count (but fail after 1 second)
        </button>
      </form>
      {error == null ? null : <div className="text-red-500">{error}</div>}
      <br />
      {user?.is_anonymous ? (
        <Link
          href="/sign-up"
          className="p-2 border border-solid border-foreground rounded-xl self-start"
        >
          Sign up
        </Link>
      ) : null}
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
