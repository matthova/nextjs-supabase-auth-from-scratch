"use client";

import { getClientSupabase } from "@/db/getClientSupabase";
import { userActions, userSelectors } from "@/lib/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/storeHooks";
import React from "react";

enum SignInState {
  INITIAL,
  LOADING,
  ERROR,
  SUCCESS,
}

export default function SignInWithEmail() {
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string>("");
  const [signInState, setSignInState] = React.useState<SignInState>(
    SignInState.INITIAL
  );

  const currentUser = useAppSelector((state) => userSelectors.getUser(state));
  const dispatch = useAppDispatch();

  async function handleSignIn() {
    setError(null);
    setSignInState(SignInState.LOADING);

    try {
      const supabase = getClientSupabase();
      const response = await supabase.auth.updateUser({
        email,
      });
      if (response.error != null) {
        throw response.error;
      }
      const user = response.data?.user;
      if (user == null) {
        throw new Error("Updated user is nullish");
      }
      dispatch(userActions.updateUser(user));
      setSignInState(SignInState.SUCCESS);
    } catch (error) {
      if (
        // @ts-expect-error Just parse it....
        error?.code === "email_exists"
      ) {
        try {
          await getClientSupabase().auth.signInWithOtp({
            email,
          });
          return;
        } catch (ex) {
          console.log("Sign up with otp error", ex);
        }
      }
      // @ts-expect-error Just parse it....
      setError(error?.message ?? "Sign Up failed");
      setSignInState(SignInState.ERROR);
    }
  }

  const newEmail = currentUser?.new_email;

  return (
    <div className="flex flex-col gap-2">
      <h1>Sign-up/Login to your account</h1>
      {newEmail == null ? null : (
        <div className="p-2">
          <div>Confirmation email has been sent to {newEmail}</div>
          <button
            className="p-2 border rounded-lg"
            onClick={async () => {
              const {
                data: { user },
              } = await getClientSupabase().auth.updateUser({
                email: newEmail,
              });
              if (user != null) {
                dispatch(userActions.updateUser(user));
              }
            }}
          >
            Resend confirmation email
          </button>
        </div>
      )}
      {signInState === SignInState.SUCCESS ? null : (
        <div className="flex flex-col gap-2">
          <div>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 ml-2 border border-solid border-foreground rounded-lg text-foreground bg-background"
              />
            </label>
          </div>
          <button
            type="submit"
            onClick={handleSignIn}
            className="px-2 py-1 border border-solid border-foreground rounded-lg self-start"
            disabled={signInState === SignInState.LOADING}
          >
            Continue
          </button>
        </div>
      )}
      {error == null ? null : <div className="text-red-500">{error}</div>}
    </div>
  );
}
