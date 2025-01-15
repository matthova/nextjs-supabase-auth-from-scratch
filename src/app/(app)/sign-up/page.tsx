"use client";

import { getClientSupabase } from "@/db/getClientSupabase";
import { userActions, userSelectors } from "@/lib/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/storeHooks";
import { useRouter } from "next/navigation";
import React from "react";

export default function SignUpPage() {
  return (
    <div>
      <SignUpWithEmailAndPassword />
    </div>
  );
}

enum SignUpState {
  INITIAL,
  LOADING,
  ERROR,
  SUCCESS,
}

function SignUpWithEmailAndPassword() {
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string>("");
  const [signUpState, setSignUpState] = React.useState<SignUpState>(
    SignUpState.INITIAL
  );

  const router = useRouter();
  const currentUser = useAppSelector((state) => userSelectors.getUser(state));
  const dispatch = useAppDispatch();

  async function handleSignUp() {
    setError(null);
    setSignUpState(SignUpState.LOADING);

    try {
      const supabase = getClientSupabase();
      const response = await supabase.auth.updateUser({
        email,
      });
      console.log("response", response);
      debugger;
      if (response.error != null) {
        debugger;
        throw response.error;
      }
      const user = response.data?.user;
      if (user == null) {
        throw new Error("Updated user is nullish");
      }
      dispatch(userActions.updateUser(user));
      setSignUpState(SignUpState.SUCCESS);
    } catch (error) {
      console.log("the error", error, JSON.stringify(error, null, 2));
      setError(error?.message ?? "oh no");
      setSignUpState(SignUpState.ERROR);
    }
  }

  const newEmail = currentUser?.new_email;

  if (currentUser?.is_anonymous === false) {
    return (
      <div>
        <div>Already signed in</div>
        <button
          onClick={async () => {
            await getClientSupabase().auth.signOut();
            dispatch(userActions.setUser(null));
          }}
        >
          Log Out?
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <h1>Sign up with email</h1>
      {newEmail == null ? null : (
        <div className="p-2">
          <div>Confirmation email has been sent to {newEmail}</div>
          <button
            className="p-2 border rounded-xl"
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
      {signUpState === SignUpState.SUCCESS ? null : (
        <div className="flex flex-col gap-2">
          <div>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 ml-2 border border-solid border-foreground rounded-xl text-foreground bg-background"
              />
            </label>
          </div>
          <button
            type="submit"
            onClick={handleSignUp}
            className="px-2 py-1 border border-solid border-foreground rounded-xl self-start"
            disabled={signUpState === SignUpState.LOADING}
          >
            Sign up
          </button>
        </div>
      )}
      {error == null ? null : <div className="text-red-500">{error}</div>}
    </div>
  );
}
