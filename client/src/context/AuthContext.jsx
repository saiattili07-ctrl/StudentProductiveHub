import { createContext, useContext, useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchCurrentUser,
} from "../services/authServices.js";

// Export AuthContext so other files can import it
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check logged-in user when the application loads
  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser()
      .then((u) => {
        if (!cancelled) {
          setUser(u);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Register user
  const register = async (payload) => {
    const u = await registerUser(payload);
    setUser(u);
    return u;
  };

  // Login user
  const login = async (payload) => {
    const u = await loginUser(payload);
    setUser(u);
    return u;
  };

  // Logout user
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom authentication hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
