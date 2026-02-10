import React, { useState, useEffect, createContext, useContext } from "react";

const USERS_KEY = "lf_users_v1";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("lf_user")) || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (user) sessionStorage.setItem("lf_user", JSON.stringify(user));
    else sessionStorage.removeItem("lf_user");
  }, [user]);

  const login = (email, name = "User") => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    let existing = users.find((u) => u.email === email);
    if (!existing) {
      existing = { id: `u${Date.now()}`, name, email };
      users.push(existing);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    setUser(existing);
    return existing;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}