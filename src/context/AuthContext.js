import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  accessToken: null,
  setAccessToken: () => {},
  refreshAccessToken: async () => null,
});

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem("accessToken") || null);

  useEffect(() => {
    if (accessToken) sessionStorage.setItem("accessToken", accessToken);
    else sessionStorage.removeItem("accessToken");
  }, [accessToken]);

  // refresh endpoint will use httpOnly refresh cookie (sent automatically with credentials: 'include')
  const refreshAccessToken = async () => {
    try {
      const resp = await fetch("http://localhost:4000/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!resp.ok) {
        setAccessToken(null);
        return null;
      }
      const data = await resp.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.error("refresh error", err);
      setAccessToken(null);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
