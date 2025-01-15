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
    <div className="flex flex-col gap-2 p-2">
      <h1>Hello, world!</h1>
      <div>Count: {optimisticCount}</div>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="px-2 py-1 border border-solid border-foreground rounded-lg"
        >
          Increment count
        </button>
      </form>
      <form onSubmit={(e) => handleSubmit(e, { fail: true })}>
        <button
          type="submit"
          className="px-2 py-1 border border-solid border-foreground rounded-lg"
        >
          Increment count (but fail after 1 second)
        </button>
      </form>
      {error == null ? null : <div className="text-red-500">{error}</div>}
      <h2>User Info</h2>
      <div>
        <table className="border-collapse border border-gray-300">
          <tbody>
            {Object.entries(user ?? {}).map(([key, value]) => (
              <tr key={key}>
                <td className="border border-gray-300 p-1">{key}</td>
                <td className="border border-gray-300 p-1">
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
