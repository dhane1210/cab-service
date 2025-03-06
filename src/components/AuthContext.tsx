// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface User {
  id: number;
  username: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; 
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    password: string,
    address: string,
    phone: string,
    nic: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate at the top level
  const [loading, setLoading] = useState(true);

  // Rehydrate user state from localStorage on app startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("Rehydrating user from localStorage:", userData);

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser({ ...parsedUser, token });

      // Redirect to /admin if the user is an admin
      if (parsedUser.role === "ADMIN") {
        navigate("/admin");
      }
    }
    setLoading(false); 
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/user/login", { username, password });
      const { token, id, username: loggedInUsername, role } = response.data;
      console.log("Role from backend:", role);
      console.log("Login response:", response.data);

      // Store the JWT token and user details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ id, username: loggedInUsername, role })
      );

      // Update the user state
      setUser({ id, username: loggedInUsername, role, token });

      // Redirect to admin dashboard if the user is an admin
      if (role === "ADMIN") {
        console.log("Redirecting to /admin");
        navigate("/admin"); // Use navigate here
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async (
    username: string,
    password: string,
    address: string,
    phone: string,
    nic: string
  ) => {
    const response = await api.post("/user/add-user", {
      username,
      password,
      address,
      phone,
      nic,
    });
    const { token, id, username: registeredUsername, role } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ id, username: registeredUsername, role })
    );
    setUser({ id, username: registeredUsername, role, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login"); // Use navigate here instead of window.location.href
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children} {/* Render children only after rehydration is complete */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};