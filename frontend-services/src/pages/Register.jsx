import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  validateRegistrationData,
} from "../api/AuthenticationService";
import { useAuth } from "../context/AuthContext";

const Register = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "", // Optional
    phone_number: "", // Mandatory
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    agreeToTerms: false,
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

    // Clear error when user starts typing
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

  const validateForm = () => {
    const newErrors = {};

    // Use the service validation
    const serviceValidation = validateRegistrationData({
      username: formData.username,
      phone_number: formData.phone_number,
      email: formData.email,
      password: formData.password,
      password_confirm: formData.password_confirm,
    });

    // Merge service validation errors
    Object.assign(newErrors, serviceValidation.errors);

    // Additional frontend-specific validations
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous API error
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API (exclude frontend-only fields)
      const apiData = {
        username: formData.username,
        password: formData.password,
        password_confirm: formData.password_confirm,
        phone_number: formData.phone_number,
        email: formData.email || "", // Send empty string if not provided
        first_name: formData.first_name || "",
        last_name: formData.last_name || "",
      };

      const result = await registerUser(apiData);

      if (result.success) {
        // Use the auth context to handle login after registration
        if (result.tokens) {
          login(result.tokens.access, result.tokens.refresh);
        }

        console.log("Registration successful:", result);

        // Navigate to dashboard after successful registration
        navigate("/dashboard");

        // Or you could redirect to login page with success message
        // navigate("/login", { state: { message: "Registration successful! Please log in." } });
      } else {
        // Handle API errors
        console.error("Registration failed:", result);

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
            setApiError(
              result.message || "Registration failed. Please try again.",
            );
          }
        } else {
          // Handle general API error (including non_field_errors)
          setApiError(
            result.message || "Registration failed. Please try again.",
          );
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate("/login");
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
          <p className="mt-2 text-slate-400">Create your account</p>
        </div>

        {/* Registration Card */}
        <div className="bg-slate-900/50 rounded-lg shadow-sm border border-slate-800 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* API Error Display */}
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{apiError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.first_name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:ring-[#1173d4]"
                  }`}
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.last_name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-700 focus:ring-[#1173d4]"
                  }`}
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                autoComplete="tel"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.phone_number
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email address{" "}
                <span className="text-sm text-slate-500">(optional)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Enter your email (optional)"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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
                autoComplete="new-password"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_confirm"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                autoComplete="new-password"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.password_confirm
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Confirm your password"
                value={formData.password_confirm}
                onChange={handleChange}
              />
              {errors.password_confirm && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password_confirm}
                </p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                className={`h-4 w-4 mt-0.5 text-[#1173d4] bg-slate-800 border-slate-700 rounded focus:ring-[#1173d4] focus:ring-2 ${
                  errors.agreeToTerms ? "border-red-500" : ""
                }`}
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <div className="ml-3">
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm text-slate-300"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-[#1173d4] hover:text-[#1173d4]/80 bg-transparent border-none cursor-pointer"
                    onClick={() => console.log("Terms clicked")}
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-[#1173d4] hover:text-[#1173d4]/80 bg-transparent border-none cursor-pointer"
                    onClick={() => console.log("Privacy policy clicked")}
                  >
                    Privacy Policy
                  </button>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1173d4] hover:bg-[#1173d4]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#1173d4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-[#1173d4] hover:text-[#1173d4]/80 bg-transparent border-none cursor-pointer"
                  onClick={handleLoginClick}
                >
                  Sign in
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

export default Register;
