import { createContext, useContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthUser, ensureMockStore, getAuthUser, setAuthUser } from "@/lib/mock-store";

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => void;
  loginAsStudent: (overrides?: Partial<AuthUser>) => void;
  loginAsTrainer: (overrides?: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
  loginAsStudent: () => {},
  loginAsTrainer: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ensureMockStore();
    setUser(getAuthUser());
    setIsLoading(false);
  }, []);

  const loginAsStudent = useCallback((overrides?: Partial<AuthUser>) => {
    const next: AuthUser = {
      id: 1,
      role: "student",
      fullName: "João Silva (MOCK)",
      email: "aluno@trainflow.app",
      avatarUrl: "https://i.pravatar.cc/150?u=joao",
      ...overrides,
    };
    setAuthUser(next);
    setUser(next);
  }, []);

  const loginAsTrainer = useCallback((overrides?: Partial<AuthUser>) => {
    const next: AuthUser = {
      id: 2,
      role: "trainer",
      fullName: "Carlos Mendes (MOCK)",
      email: "trainer@trainflow.app",
      avatarUrl: "https://i.pravatar.cc/150?u=marcos",
      ...overrides,
    };
    setAuthUser(next);
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    const nextHref = user?.role === "trainer" ? "/t/login" : "/login";
    setAuthUser(null);
    setUser(null);
    window.location.href = nextHref;
  }, [user?.role]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      logout,
      loginAsStudent,
      loginAsTrainer,
    }),
    [user, isLoading, logout, loginAsStudent, loginAsTrainer]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
