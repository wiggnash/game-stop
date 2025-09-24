import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "", // Optional
    phoneNumber: "", // Mandatory
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email is optional, but if provided, should be valid
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone number is mandatory
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Registration submitted:", formData);
      // Handle registration logic here
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
          <div className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
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
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-[#1173d4]"
                }`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
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
                type="button"
                onClick={handleSubmit}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1173d4] hover:bg-[#1173d4]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#1173d4] transition-colors"
              >
                Create Account
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-[#1173d4] hover:text-[#1173d4]/80 bg-transparent border-none cursor-pointer"
                  onClick={() => console.log("Navigate to login")}
                >
                  Sign in
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

export default Register;
