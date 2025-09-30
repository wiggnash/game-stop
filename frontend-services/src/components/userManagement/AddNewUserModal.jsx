import React, { useState, useEffect } from "react";
import * as rolesApi from "../../api/roles.api";
import { X, User, Mail, Phone, Lock, UserCog } from "lucide-react";

const AddNewUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.role && roles.length > 0) {
      const selectedRole = roles.find(
        (role) => role.id === parseInt(formData.role),
      );
      setShowPasswordFields(selectedRole?.role_name.toLowerCase() === "admin");
    } else {
      setShowPasswordFields(false);
    }
  }, [formData.role, roles]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await rolesApi.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Show password fields for both Admin and Customer
    if (formData.role) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-xl bg-slate-900 shadow-2xl transition-all border border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#1173d4]/10 p-2">
                <User className="w-5 h-5 text-[#1173d4]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Add New User
                </h3>
                <p className="text-sm text-slate-400">
                  Create a new customer or admin account
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* First Name and Last Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full rounded-lg bg-slate-800 border ${
                      errors.firstName ? "border-red-500" : "border-slate-700"
                    } px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#1173d4] focus:ring-1 focus:ring-[#1173d4] outline-none transition-colors`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full rounded-lg bg-slate-800 border ${
                      errors.lastName ? "border-red-500" : "border-slate-700"
                    } px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#1173d4] focus:ring-1 focus:ring-[#1173d4] outline-none transition-colors`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full rounded-lg bg-slate-800 border ${
                      errors.username ? "border-red-500" : "border-slate-700"
                    } pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#1173d4] focus:ring-1 focus:ring-[#1173d4] outline-none transition-colors`}
                    placeholder="Enter username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-400">{errors.username}</p>
                )}
              </div>

              {/* Phone Number and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full rounded-lg bg-slate-800 border ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-slate-700"
                      } pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#1173d4] focus:ring-1 focus:ring-[#1173d4] outline-none transition-colors`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-slate-800 border border-slate-700 pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#1173d4] focus:ring-1 focus:ring-[#1173d4] outline-none transition-colors"
                      placeholder="Enter email (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loadingRoles}
                    className={`w-full rounded-lg bg-slate-800 border ${
                      errors.role ? "border-red-500" : "border-slate-700"
                    } pl-10 pr-4 py-2.5 text-white focus:border-[#1173d4] focus:ring-1 focus:ring-[#1173d4] outline-none transition-colors appearance-none`}
                  >
                    <option value="">
                      {loadingRoles ? "Loading roles..." : "Select a role"}
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-400">{errors.role}</p>
                )}
              </div>

              {/* Password Fields - Show when role is selected */}
              {showPasswordFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full rounded-lg bg-slate-800 border ${
                          errors.password
                            ? "border-red-500"
                            : "border-slate-700"
                        } pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#1173d4] focus:ring-1 focus:ring-[#1173d4] outline-none transition-colors`}
                        placeholder="Enter password"
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full rounded-lg bg-slate-800 border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-slate-700"
                        } pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#1173d4] focus:ring-1 focus:ring-[#1173d4] outline-none transition-colors`}
                        placeholder="Confirm password"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#1173d4] text-white hover:bg-[#1173d4]/90 transition-colors font-medium shadow-sm"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewUserModal;
