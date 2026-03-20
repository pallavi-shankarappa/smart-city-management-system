import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

function safeDecode(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken ? safeDecode(savedToken) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const decoded = safeDecode(token);
      setUser(decoded);
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user, // { id, role, iat, exp }
      isAuthed: Boolean(token && user),
      login: (newToken) => setToken(newToken),
      logout: () => {
        setToken(null);
        localStorage.removeItem("token");
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

