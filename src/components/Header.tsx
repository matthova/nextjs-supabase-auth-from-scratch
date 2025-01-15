"use client";

import Link from "next/link";
import { getClientSupabase } from "@/db/getClientSupabase";
import { userActions, userSelectors } from "@/lib/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/storeHooks";

export function Header() {
  const user = useAppSelector((state) => userSelectors.getUser(state));
  const dispatch = useAppDispatch();

  return (
    <div className="p-2 flex justify-between border border-solid border-foreground">
      <Link href="/">Home</Link>
      {user?.is_anonymous ? (
        <Link href="/sign-in">Sign in</Link>
      ) : (
        <button
          onClick={async () => {
            await getClientSupabase().auth.signOut();
            dispatch(userActions.setUser(null));
          }}
        >
          Log Out
        </button>
      )}
    </div>
  );
}
