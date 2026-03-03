"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UserRole = "rider" | "motorider";

type SessionUser = {
  account: string;
  role: UserRole;
};

type LoginResult = {
  success: boolean;
  role?: UserRole;
  error?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: SessionUser | null;
  login: (account: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "greenride-session";

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored) as SessionUser;
      if (parsed?.account && parsed?.role) {
        return parsed;
      }
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    }

    return null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login: async (account: string, password: string) => {
        if (!account || !password) {
          return { success: false, error: "Please enter account and password." };
        }

        const role: UserRole =
          account.toLowerCase() === "motar" && password === "motar"
            ? "motorider"
            : "rider";

        const nextUser: SessionUser = { account, role };
        setUser(nextUser);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
        }

        return { success: true, role };
      },
      logout: () => {
        setUser(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(SESSION_KEY);
        }
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
