import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CurrentUser } from "@/lib/api";

export type SessionStatus = "idle" | "loading" | "authenticated" | "guest";

type SessionState = {
  user: CurrentUser | null;
  status: SessionStatus;
};

const initialState: SessionState = {
  user: null,
  status: "idle",
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    sessionLoading(state) {
      state.status = "loading";
    },
    sessionLoaded(state, action: PayloadAction<CurrentUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    sessionCleared(state) {
      state.user = null;
      state.status = "guest";
    },
  },
});

export const { sessionLoading, sessionLoaded, sessionCleared } = sessionSlice.actions;
export default sessionSlice.reducer;
