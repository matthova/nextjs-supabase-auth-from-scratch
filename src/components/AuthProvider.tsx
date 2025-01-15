"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/storeHooks";
import { userActions, userSelectors } from "@/lib/slices/userSlice";
import { getClientSupabase } from "@/db/getClientSupabase";

// Block from rendering the app until we have a user
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => userSelectors.getUser(state));
  const dispatch = useAppDispatch();
  const creatingUser = React.useRef(false);

  React.useEffect(() => {
    async function createAnonymousUser() {
      if (creatingUser.current || user != null) return;
      creatingUser.current = true;
      const { data, error } =
        await getClientSupabase().auth.signInAnonymously();
      if (error) {
        console.error("Error creating anonymous user:", error.message);
        return;
      }
      if (data.session == null) {
        console.error("No session returned from anonymous sign-in");
        return;
      }
      if (data.user == null) {
        console.error("No user returned from anonymous sign-in");
        return;
      }
      dispatch(
        userActions.initializeUser({ user: data.user, session: data.session })
      );
      creatingUser.current = false;
    }
    createAnonymousUser();
  }, [dispatch, user]);

  // if (user == null) {
  //   return <div>Loading...</div>;
  // }

  return <>{children}</>;
}
