import React, { createContext, useContext, useEffect, useState } from "react";
import { tokenUtils } from "../api/TokenAuthenticationService";

// Create the Authentication Context
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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // Store user info if needed

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const authStatus = tokenUtils.isAuthenticated();
      setIsAuthenticated(authStatus);

      // If authenticated, you could also decode and set user info
      if (authStatus) {
        const userInfo = tokenUtils.getUserInfo();
        setUser(userInfo);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Optional: Set up token refresh interval
    const refreshInterval = tokenUtils.setupTokenRefresh(() => {
      // Token expired, logout user
      logout();
    });

    // Cleanup interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const login = (accessToken, refreshToken, userInfo = null) => {
    tokenUtils.setTokens(accessToken, refreshToken);
    setIsAuthenticated(true);

    // Set user info if provided or decode from token
    const userData = userInfo || tokenUtils.getUserInfo();
    setUser(userData);
  };

  const logout = () => {
    tokenUtils.clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const result = await tokenUtils.refreshAccessToken();
      if (result.success) {
        return result.accessToken;
      } else {
        // Refresh failed, logout user
        logout();
        return null;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  };

  const value = {
    // State
    isAuthenticated,
    isLoading,
    user,

    // Methods
    login,
    logout,
    refreshToken,

    // Token utilities (if needed by components)
    getAccessToken: tokenUtils.getAccessToken,
    getRefreshToken: tokenUtils.getRefreshToken,
    isTokenExpired: tokenUtils.isTokenExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
