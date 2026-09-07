import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/store/api/baseApi";
import sessionReducer from "@/store/slices/sessionSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      session: sessionReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
