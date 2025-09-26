import React, { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth.api";
import * as tokenStorage from "../services/tokenStorage.service";

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const hasValidToken = tokenStorage.hasValidToken();
      setIsAuthenticated(hasValidToken);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login method
  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);

      // Store tokens
      tokenStorage.setTokens(response.tokens.access, response.tokens.refresh);

      // Update state
      setIsAuthenticated(true);

      return { success: true, data: response };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  };

  // Register method
  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);

      // Store tokens
      tokenStorage.setTokens(response.tokens.access, response.tokens.refresh);

      // Update state
      setIsAuthenticated(true);

      return { success: true, data: response };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  };

  // Logout method
  const logout = () => {
    tokenStorage.clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      console.error("Fetch user error:", error);
      // If /me/ fails, likely token is invalid - logout
      if (error.response?.status === 401) {
        logout();
      }
      return { success: false, error: error.message };
    }
  };

  const value = {
    // State
    isAuthenticated,
    user,
    isLoading,

    // Methods
    login,
    register,
    logout,
    fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
