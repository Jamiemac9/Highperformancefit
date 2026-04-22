import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../lib/api";
import { apiGet, apiPost } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const refresh = async () => {
    try {
      const data = await apiGet("/api/auth/me");
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (credentials: any) => {
    const data = await apiPost("/api/auth/login", credentials);
    setUser(data.user);
    queryClient.invalidateQueries();
  };

  const register = async (data: any) => {
    const res = await apiPost("/api/auth/register", data);
    setUser(res.user);
    queryClient.invalidateQueries();
  };

  const logout = async () => {
    await apiPost("/api/auth/logout");
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
