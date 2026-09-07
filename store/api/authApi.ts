import { baseApi } from "@/store/api/baseApi";

import type { CurrentUser, TokenPair } from "@/lib/api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokenPair, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Session"],
    }),
    getMe: build.query<CurrentUser, void>({
      query: () => "/auth/me",
      transformResponse: (response: { user: CurrentUser }) => response.user,
      providesTags: ["Session"],
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST", body: {} }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const { useLazyGetMeQuery, useLoginMutation, useLogoutMutation } = authApi;
