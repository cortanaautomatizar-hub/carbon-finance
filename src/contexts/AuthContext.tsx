import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { setUserId as setCardsUserId } from "@/services/cards";

type User = { id?: number; name?: string; email?: string; phone?: string };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário demo para desenvolvimento/demo
const DEMO_USER: User = {
  id: 1,
  name: "Demo User",
  email: "demo@carbonfinance.com",
  phone: "+55 11 99999-9999",
};

const DEMO_TOKEN = "demo_token_123456789";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-login na primeira inicialização se não houver sessão
  useEffect(() => {
    if (!isInitialized && !token && !user) {
      // Fazer auto-login com usuário demo
      setUser(DEMO_USER);
      setToken(DEMO_TOKEN);
      setCardsUserId(DEMO_USER.id!);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");

    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [token, user]);

  const login = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    // Isolar dados por usuário
    if (u.id) {
      setCardsUserId(u.id);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Limpar userId ao fazer logout
    setCardsUserId(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
};

export default AuthContext;
