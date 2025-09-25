import { apiClient } from "./AuthenticationService";

// JWT Token utilities and management
export const tokenUtils = {
  // Token storage keys
  ACCESS_TOKEN_KEY: "accessToken",
  REFRESH_TOKEN_KEY: "refreshToken",
  AUTH_STATUS_KEY: "isAuthenticated",
  REMEMBER_ME_KEY: "rememberMe",

  // Get tokens from storage
  getAccessToken: () => localStorage.getItem(tokenUtils.ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(tokenUtils.REFRESH_TOKEN_KEY),

  // Set tokens in storage
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(tokenUtils.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(tokenUtils.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(tokenUtils.AUTH_STATUS_KEY, "true");
  },

  // Clear all authentication data
  clearTokens: () => {
    localStorage.removeItem(tokenUtils.ACCESS_TOKEN_KEY);
    localStorage.removeItem(tokenUtils.REFRESH_TOKEN_KEY);
    localStorage.removeItem(tokenUtils.AUTH_STATUS_KEY);
    localStorage.removeItem(tokenUtils.REMEMBER_ME_KEY);
  },

  // Check if a JWT token is expired
  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      // JWT token has 3 parts separated by dots
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      const currentTime = Date.now() / 1000;

      // Check if token is expired (add 60 seconds buffer)
      return decodedPayload.exp < currentTime + 60;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  },

  // Decode JWT token payload
  decodeToken: (token) => {
    if (!token) return null;

    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // Get user info from access token
  getUserInfo: () => {
    const accessToken = tokenUtils.getAccessToken();
    if (!accessToken) return null;

    const payload = tokenUtils.decodeToken(accessToken);
    if (!payload) return null;

    return {
      userId: payload.user_id,
      username: payload.username,
      email: payload.email,
      exp: payload.exp,
      iat: payload.iat,
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const accessToken = tokenUtils.getAccessToken();
    const refreshToken = tokenUtils.getRefreshToken();

    // If no tokens, definitely not authenticated
    if (!accessToken || !refreshToken) {
      return false;
    }

    // If access token is not expired, user is authenticated
    if (!tokenUtils.isTokenExpired(accessToken)) {
      return true;
    }

    // If refresh token is also expired, user needs to login again
    if (tokenUtils.isTokenExpired(refreshToken)) {
      tokenUtils.clearTokens();
      return false;
    }

    // Access token expired but refresh token is valid
    // In a real app, you might want to refresh the token here
    // For now, we'll consider them authenticated but might need refresh
    return true;
  },

  // Refresh access token using refresh token
  refreshAccessToken: async () => {
    const refreshToken = tokenUtils.getRefreshToken();

    if (!refreshToken || tokenUtils.isTokenExpired(refreshToken)) {
      return {
        success: false,
        error: "No valid refresh token available",
      };
    }

    try {
      const response = await apiClient.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      if (response.data.access) {
        const newAccessToken = response.data.access;

        // Update access token in storage
        localStorage.setItem(tokenUtils.ACCESS_TOKEN_KEY, newAccessToken);

        return {
          success: true,
          accessToken: newAccessToken,
        };
      } else {
        return {
          success: false,
          error: "Invalid response from refresh endpoint",
        };
      }
    } catch (error) {
      console.error("Token refresh failed:", error);

      return {
        success: false,
        error: error.response?.data?.detail || "Token refresh failed",
      };
    }
  },

  // Set up automatic token refresh
  setupTokenRefresh: (onTokenExpired) => {
    const checkAndRefreshToken = async () => {
      const accessToken = tokenUtils.getAccessToken();

      if (!accessToken) return;

      // Check if token will expire in the next 5 minutes
      const payload = tokenUtils.decodeToken(accessToken);
      if (!payload) return;

      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;

      // If token expires in less than 5 minutes, refresh it
      if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
        const result = await tokenUtils.refreshAccessToken();

        if (!result.success) {
          console.log("Token refresh failed, logging out user");
          onTokenExpired();
        }
      } else if (timeUntilExpiry <= 0) {
        // Token already expired
        console.log("Token expired, logging out user");
        onTokenExpired();
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 300000);

    // Check immediately
    checkAndRefreshToken();

    return interval;
  },

  // Add token to request headers (for API calls)
  getAuthHeaders: () => {
    const accessToken = tokenUtils.getAccessToken();

    if (!accessToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  },

  // Check if token needs refresh (expires in next 5 minutes)
  needsRefresh: () => {
    const accessToken = tokenUtils.getAccessToken();

    if (!accessToken) return false;

    const payload = tokenUtils.decodeToken(accessToken);
    if (!payload) return false;

    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;

    // Need refresh if token expires in the next 5 minutes
    return timeUntilExpiry < 300 && timeUntilExpiry > 0;
  },

  // Get token expiration time
  getTokenExpiration: () => {
    const accessToken = tokenUtils.getAccessToken();

    if (!accessToken) return null;

    const payload = tokenUtils.decodeToken(accessToken);
    if (!payload) return null;

    return new Date(payload.exp * 1000);
  },

  // Get time until token expires (in seconds)
  getTimeUntilExpiry: () => {
    const accessToken = tokenUtils.getAccessToken();

    if (!accessToken) return 0;

    const payload = tokenUtils.decodeToken(accessToken);
    if (!payload) return 0;

    const currentTime = Date.now() / 1000;
    return Math.max(0, payload.exp - currentTime);
  },
};
