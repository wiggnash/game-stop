import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, validateLoginData } from "../api/AuthenticationService";
import { useAuth } from "../context/AuthContext";

const Login = ({ onLoginSuccess, onRegisterClick }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "", // Can be email or phone
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear API error
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous API error
    setApiError("");

    // Validate form data
    const validation = validateLoginData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser(formData);

      if (result.success) {
        // Use the auth context to handle login
        if (result.tokens) {
          login(result.tokens.access, result.tokens.refresh);

          // Handle remember me
          if (formData.rememberMe) {
            localStorage.setItem("rememberMe", "true");
          }
        }

        console.log("Login successful:", result);

        // For Method 1 (Simple state)
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          // For Method 2 (Router) - navigate to dashboard
          navigate("/dashboard");
        }
      } else {
        // Handle API errors
        console.error("Login failed:", result);

        if (result.validationErrors && result.validationErrors !== null) {
          // Handle field-specific errors from the API
          const apiErrors = {};
          Object.keys(result.validationErrors).forEach((field) => {
            // Skip non_field_errors as they're handled as general API errors
            if (field !== "non_field_errors") {
              if (Array.isArray(result.validationErrors[field])) {
                apiErrors[field] = result.validationErrors[field][0];
              } else {
                apiErrors[field] = result.validationErrors[field];
              }
            }
          });

          // Only set field errors if we have any, otherwise show general error
          if (Object.keys(apiErrors).length > 0) {
            setErrors(apiErrors);
          } else {
            setApiError(result.message || "Login failed. Please try again.");
          }
        } else {
          // Handle general API error (including non_field_errors)
          setApiError(result.message || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // For Method 1 (Simple state)
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      // For Method 2 (Router)
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-[#101922] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 text-[#1173d4] mb-4">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">GameHub</h2>
          <p className="mt-2 text-slate-400">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 rounded-lg shadow-sm border border-slate-800 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* API Error Display */}
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{apiError}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email or Phone Number
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.identifier
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Enter your email or phone number"
                value={formData.identifier}
                onChange={handleChange}
              />
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-500">{errors.identifier}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-[#1173d4] bg-slate-800 border-slate-700 rounded focus:ring-[#1173d4] focus:ring-2"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-[#1173d4] hover:text-[#1173d4]/80 bg-transparent border-none cursor-pointer"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1173d4] hover:bg-[#1173d4]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#1173d4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-[#1173d4] hover:text-[#1173d4]/80 bg-transparent border-none cursor-pointer"
                  onClick={handleRegisterClick}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            © 2024 GameHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
