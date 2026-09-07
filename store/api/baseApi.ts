import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  type TokenPair,
} from "@/lib/api";
import { sessionCleared } from "@/store/slices/sessionSlice";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const AUTH_ENDPOINTS = new Set(["login", "refresh", "logout"]);

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (
    result.error?.status !== 401 ||
    (api.endpoint && AUTH_ENDPOINTS.has(api.endpoint))
  ) {
    return result;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    api.dispatch(sessionCleared());
    return result;
  }

  const refreshed = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      body: { refresh_token: refreshToken },
    },
    api,
    extraOptions,
  );

  if (refreshed.data) {
    const tokens = refreshed.data as TokenPair;
    if (tokens.access_token && tokens.refresh_token) {
      saveTokens(tokens);
      return rawBaseQuery(args, api, extraOptions);
    }
  }

  clearTokens();
  api.dispatch(sessionCleared());
  return result;
};

export const baseApi = createApi({
  reducerPath: "qlockcareAdminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Admin", "AdminList", "Session"],
  endpoints: () => ({}),
});
