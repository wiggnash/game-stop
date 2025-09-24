import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For Method 2 (Router)

const Login = ({ onLoginSuccess, onRegisterClick }) => {
  // For Method 1 (Simple)
  const navigate = useNavigate(); // For Method 2 (Router)
  const [formData, setFormData] = useState({
    identifier: "", // Can be email or phone
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine if identifier is email or phone
    const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);
    const isPhone = /^\+?[\d\s\-\(\)]+$/.test(formData.identifier);

    console.log("Login submitted:", {
      ...formData,
      loginType: isEmail ? "email" : isPhone ? "phone" : "unknown",
    });

    // Simulate login success
    if (formData.identifier && formData.password) {
      // For Method 1 (Simple state)
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // For Method 2 (Router)
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
      }
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
          <div className="space-y-6">
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
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent"
                placeholder="Enter your email or phone number"
                value={formData.identifier}
                onChange={handleChange}
              />
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
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:border-transparent"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
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
                type="button"
                onClick={handleSubmit}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1173d4] hover:bg-[#1173d4]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#1173d4] transition-colors"
              >
                Sign in
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
          </div>
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
