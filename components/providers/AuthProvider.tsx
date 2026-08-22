"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ApiError,
  clearTokens,
  getAccessToken,
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  type CurrentUser,
} from "@/lib/api";

type AuthContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getMe();
      // Accept both SUPER_ADMIN (full cross-tenant) and PLATFORM_ADMIN
      // (scoped cross-tenant via admin_scopes). The Sidebar uses the
      // current user's role + scopes to decide which items to show.
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
      setUser(currentUser);
    } catch (error) {
      clearTokens();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCurrentUser().catch(() => {
      setIsLoading(false);
    });
  }, [loadCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    if (
      data.user.role !== "SUPER_ADMIN" &&
      data.user.role !== "PLATFORM_ADMIN"
    ) {
      clearTokens();
      throw new ApiError(
        403,
        "Only super admin or platform admin accounts can access this dashboard.",
      );
    }
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      logout,
      reloadUser: loadCurrentUser,
    }),
    [isLoading, loadCurrentUser, login, logout, user],
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
