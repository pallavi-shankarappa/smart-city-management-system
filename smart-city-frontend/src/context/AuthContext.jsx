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
  const user = useMemo(() => (token ? safeDecode(token) : null), [token]);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      return;
    }
    localStorage.setItem("token", token);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user, // { id, role, iat, exp }
      isAuthed: Boolean(token && user),
      login: (newToken) => setToken(newToken),
      logout: () => setToken(null),
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

