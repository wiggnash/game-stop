import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/common/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SessionDashboard from "./pages/SessionDashboard";
import FinancialDashboard from "./pages/FinancialDashboard";
import NewSession from "./pages/NewSession";
import SessionDetails from "./pages/SessionDetails";
import SnacksManagement from "./pages/SnacksManagement";
import UserDashboard from "./pages/UserDashboard";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // For now, we'll use localStorage to check authentication
  // Later, you can replace this with your actual auth logic
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Layout component for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-dark">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SessionDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/financial"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FinancialDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-session"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NewSession />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/session/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SessionDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/snacks"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SnacksManagement />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
