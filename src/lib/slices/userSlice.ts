import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";

export interface UserSliceState {
  user: User | null;
  session: Session | null;
}

const initialState: UserSliceState = {
  user: null,
  session: null,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const userSlice = createAppSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    initializeUser: create.reducer(
      (state, action: PayloadAction<{ user: User; session: Session }>) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
      }
    ),
    setUser: create.reducer((state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    }),
    updateUser: create.reducer(
      (state, action: PayloadAction<Partial<User>>) => {
        if (state.user == null) {
          throw new Error("No user to update");
        }
        state.user = { ...(state.user ?? {}), ...action.payload };
      }
    ),
  }),
  selectors: {
    getUser: (userSlice) => userSlice.user,
  },
});

export const userActions = userSlice.actions;
export const userSelectors = userSlice.selectors;
