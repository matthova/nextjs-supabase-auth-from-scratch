"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
import { userActions, UserObject } from "@/lib/slices/userSlice";

export default function StoreProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserObject | null;
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
