"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import {
  ApiError,
  clearTokens,
  getAccessToken,
  saveTokens,
  type CurrentUser,
} from "@/lib/api";
import { useLazyGetMeQuery, useLoginMutation, useLogoutMutation } from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sessionCleared, sessionLoaded, sessionLoading } from "@/store/slices/sessionSlice";

type AuthContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.session);
  const [getMe] = useLazyGetMeQuery();
  const [loginRequest] = useLoginMutation();
  const [logoutRequest] = useLogoutMutation();

  const assertDashboardRole = useCallback((currentUser: CurrentUser) => {
    if (
      currentUser.role !== "SUPER_ADMIN" &&
      currentUser.role !== "PLATFORM_ADMIN"
    ) {
      clearTokens();
      throw new ApiError(
        403,
        "Only super admin or platform admin accounts can access this dashboard.",
      );
    }
  }, []);

  const loadCurrentUser = useCallback(async () => {
    dispatch(sessionLoading());
    if (!getAccessToken()) {
      dispatch(sessionCleared());
      return;
    }

    try {
      const currentUser = await getMe().unwrap();
      assertDashboardRole(currentUser);
      dispatch(sessionLoaded(currentUser));
    } catch (error) {
      clearTokens();
      dispatch(sessionCleared());
      throw error;
    }
  }, [assertDashboardRole, dispatch, getMe]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCurrentUser().catch(() => {
      dispatch(sessionCleared());
    });
  }, [dispatch, loadCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest({ email, password }).unwrap();
    saveTokens(data);
    assertDashboardRole(data.user);
    dispatch(sessionLoaded(data.user));
  }, [assertDashboardRole, dispatch, loginRequest]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest().unwrap();
    } finally {
      clearTokens();
      dispatch(sessionCleared());
    }
  }, [dispatch, logoutRequest]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: status === "idle" || status === "loading",
      login,
      logout,
      reloadUser: loadCurrentUser,
    }),
    [loadCurrentUser, login, logout, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
