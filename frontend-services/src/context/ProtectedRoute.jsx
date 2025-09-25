import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background-dark flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1173d4]"></div>
      <p className="text-white text-sm">Loading...</p>
    </div>
  </div>
);

// Protected Route Component - requires authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component - redirects to dashboard if already authenticated
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#101922] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1173d4]"></div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};
