"use client";
import React, { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
import { userActions } from "@/lib/slices/userSlice";
import { User } from "@supabase/supabase-js";

export default function StoreProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    if (initialUser != null) {
      storeRef.current.dispatch(userActions.setUser(initialUser));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
