import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { setUserId as setCardsUserId } from "@/services/cards";
import getSupabase from "@/services/supabase";

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
    const sb = getSupabase();

    const trySupabaseSession = async () => {
      if (!sb) return false;
      try {
        // attempt to get current session/user from Supabase
        // supabase-js v2 exposes auth.getSession / auth.getUser
        // best-effort without strict typing here
        // @ts-ignore
        const sessionResp = await sb.auth.getSession?.();
        // @ts-ignore
        const userResp = await sb.auth.getUser?.();

        const sbUser = userResp?.data?.user ?? sessionResp?.data?.session?.user ?? null;
        const accessToken = sessionResp?.data?.session?.access_token ?? null;

        if (sbUser) {
          const u: User = { id: Number(sbUser.id) || undefined, name: sbUser.user_metadata?.name ?? sbUser.email, email: sbUser.email };
          setUser(u);
          setToken(accessToken ?? null);
          if (u.id) setCardsUserId(u.id as number);
          return true;
        }
      } catch (e) {
        // ignore and fallback
      }
      return false;
    };

    (async () => {
      if (!isInitialized) {
        const usedSupabase = await trySupabaseSession();
        if (!usedSupabase) {
          // fallback: auto-login demo in non-production or Vercel preview environments
          const allowDemo = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview';
          if (!token && !user && allowDemo) {
            setUser(DEMO_USER);
            setToken(DEMO_TOKEN);
            setCardsUserId(DEMO_USER.id!);
          }
        }
        setIsInitialized(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");

    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [token, user]);

  const login = async (u: User, t: string) => {
    // If Supabase configured, rely on its auth flows; but also allow manual login
    const sb = getSupabase();
    if (sb && u.email && t === "supabase") {
      // nothing to do: supabase session should be already set via its SDK
    } else {
      setUser(u);
      setToken(t);
    }
    if (u.id) setCardsUserId(u.id);
  };

  const logout = async () => {
    const sb = getSupabase();
    if (sb) {
      try {
        // @ts-ignore
        await sb.auth.signOut?.();
      } catch (e) {
        // ignore
      }
    }
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

  // Allow previews to view the app with the demo user even when no Supabase token
  const isPreviewView = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV !== 'production';
  const { user } = useAuth();

  if (!token) {
    if (isPreviewView && user) return <>{children}</>;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthContext;
