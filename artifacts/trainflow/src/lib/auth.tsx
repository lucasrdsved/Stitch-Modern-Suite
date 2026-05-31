import { createContext, useContext, ReactNode } from "react";
import { useGetMe, useLogout } from "@workspace/api-client-react";

type User = {
  id: number;
  role: "trainer" | "student";
  fullName: string;
  email: string;
  avatarUrl?: string | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // MOCK DATA FOR FRONTEND PREVIEW
  const mockUser: User = {
    id: 1,
    role: "trainer",
    fullName: "Carlos Mendes (MOCK)",
    email: "trainer@trainflow.app",
    avatarUrl: null
  };

  const logout = () => {
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        isLoading: false,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
