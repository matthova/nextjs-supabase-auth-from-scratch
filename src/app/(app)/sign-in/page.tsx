"use client";

import { getClientSupabase } from "@/db/getClientSupabase";
import { userActions, userSelectors } from "@/lib/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/storeHooks";
import React from "react";

enum SignInState {
  INITIAL,
  INITIAL_LOADING,
  CONFIRMATION_EMAIL_LOADING,
  CONFIRMATION_EMAIL_SUCCESS,
  MAGIC_LINK_LOADING,
  MAGIC_LINK_SUCCESS,
  ERROR,
}

export default function SignInWithEmail() {
  const user = useAppSelector((state) => userSelectors.getUser(state));
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string>(user?.new_email ?? "");
  const [signInState, setSignInState] = React.useState<SignInState>(
    user?.new_email == null
      ? SignInState.INITIAL
      : SignInState.CONFIRMATION_EMAIL_SUCCESS
  );

  const dispatch = useAppDispatch();

  async function handleSignIn() {
    setError(null);
    setSignInState(SignInState.INITIAL_LOADING);

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
      setSignInState(SignInState.CONFIRMATION_EMAIL_SUCCESS);
    } catch (error) {
      if (
        // @ts-expect-error Just parse it....
        error?.code === "email_exists"
      ) {
        try {
          setSignInState(SignInState.MAGIC_LINK_LOADING);
          await getClientSupabase().auth.signInWithOtp({
            email,
          });
          setSignInState(SignInState.MAGIC_LINK_SUCCESS);
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

  if (user?.is_anonymous === false) {
    return <div>Already signed in as {user.email}</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-bold text-lg">Sign-up / Login to your account</h1>
        {[
          SignInState.CONFIRMATION_EMAIL_LOADING,
          SignInState.CONFIRMATION_EMAIL_SUCCESS,
        ].includes(signInState) ? (
          <>
            <div>Confirmation email has been sent to {email}</div>
            <button
              disabled={signInState === SignInState.MAGIC_LINK_LOADING}
              className="p-2 border border-foreground rounded-lg disabled:opacity-50"
              onClick={async () => {
                setSignInState(SignInState.CONFIRMATION_EMAIL_LOADING);
                try {
                  const {
                    data: { user },
                  } = await getClientSupabase().auth.updateUser({
                    email,
                  });
                  if (user != null) {
                    dispatch(userActions.updateUser(user));
                  }
                } catch (ex) {
                  console.log("Confirmation email send error", ex);
                  setSignInState(SignInState.ERROR);
                }
              }}
            >
              Resend confirmation email
            </button>
            <button
              className="p-2 border border-foreground rounded-lg disabled:opacity-50"
              onClick={async () => {
                setEmail("");
                setSignInState(SignInState.INITIAL);
              }}
            >
              Sign in with different email
            </button>
          </>
        ) : null}
        {[
          SignInState.MAGIC_LINK_LOADING,
          SignInState.MAGIC_LINK_SUCCESS,
        ].includes(signInState) ? (
          <>
            <div>Magic link has been sent to {email}</div>
            <div>Check your email to sign in</div>
            <button
              disabled={signInState === SignInState.MAGIC_LINK_LOADING}
              className="p-2 border border-foreground rounded-lg disabled:opacity-50"
              onClick={async () => {
                setSignInState(SignInState.MAGIC_LINK_LOADING);
                try {
                  await getClientSupabase().auth.signInWithOtp({
                    email,
                  });
                  setSignInState(SignInState.MAGIC_LINK_SUCCESS);
                } catch (ex) {
                  console.log("Sign in with otp error", ex);
                  setSignInState(SignInState.ERROR);
                }
              }}
            >
              Resend Magic Link
            </button>
            <button
              className="p-2 border border-foreground rounded-lg disabled:opacity-50"
              onClick={async () => {
                setSignInState(SignInState.INITIAL);
                setEmail("");
              }}
            >
              Sign in with different email
            </button>
          </>
        ) : null}
        {[SignInState.INITIAL, SignInState.INITIAL_LOADING].includes(
          signInState
        ) ? (
          <>
            <div>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="p-2 ml-2 border border-solid border-foreground text-foreground bg-background"
                />
              </label>
            </div>
            <button
              type="submit"
              onClick={handleSignIn}
              className="px-2 py-1 border border-solid border-foreground rounded-lg"
            >
              Continue
            </button>
          </>
        ) : null}
        {signInState === SignInState.ERROR ? (
          <div className="text-red-500 font-bold">
            {error ?? "Sign in error"}
          </div>
        ) : null}
      </div>
    </div>
  );
}
