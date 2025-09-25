import axios from "axios";

// Get base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

const determineLoginType = (identifier) => {
  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;

  if (emailRegex.test(identifier)) {
    return "email";
  } else if (phoneRegex.test(identifier)) {
    return "phone";
  } else {
    throw new Error("Invalid identifier format");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post(
      "/api/user-profiles/register/",
      userData,
    );

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Registration successful",
      tokens: response.data.tokens || null,
    };
  } catch (error) {
    console.error("Registration error:", error);

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle non_field_errors as general API error
      if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
        return {
          success: false,
          error: data,
          message: data.non_field_errors[0] || "Registration failed",
          status: status,
          validationErrors: null, // No field-specific errors
        };
      }

      return {
        success: false,
        error: data,
        message: data.message || "Registration failed",
        status: status,
        validationErrors: data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: "Network error",
        message:
          "Unable to connect to the server. Please check your internet connection.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message,
        message: "An unexpected error occurred during registration.",
      };
    }
  }
};

export const loginUser = async (loginData) => {
  try {
    // Determine login type automatically
    const loginType = determineLoginType(loginData.identifier);

    const payload = {
      identifier: loginData.identifier,
      password: loginData.password,
      rememberMe: loginData.rememberMe || false,
      loginType: loginType,
    };

    const response = await apiClient.post("/api/user-profiles/login/", payload);

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Login successful",
      tokens: response.data.tokens || null,
      loginType: loginType,
    };
  } catch (error) {
    console.error("Login error:", error);

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle non_field_errors as general API error
      if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
        return {
          success: false,
          error: data,
          message: data.non_field_errors[0] || "Login failed",
          status: status,
          validationErrors: null, // No field-specific errors
        };
      }

      return {
        success: false,
        error: data,
        message: data.message || "Login failed",
        status: status,
        validationErrors: data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: "Network error",
        message:
          "Unable to connect to the server. Please check your internet connection.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message,
        message: "An unexpected error occurred during login.",
      };
    }
  }
};

export const validateRegistrationData = (formData) => {
  const errors = {};

  // Required fields
  if (!formData.username?.trim()) {
    errors.username = "Username is required";
  }

  if (!formData.phone_number?.trim()) {
    errors.phone_number = "Phone number is required";
  } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone_number)) {
    errors.phone_number = "Please enter a valid phone number";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!formData.password_confirm) {
    errors.password_confirm = "Please confirm your password";
  } else if (formData.password !== formData.password_confirm) {
    errors.password_confirm = "Passwords do not match";
  }

  // Email validation (if provided)
  if (formData.email?.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors,
  };
};

export const validateLoginData = (formData) => {
  const errors = {};

  if (!formData.identifier?.trim()) {
    errors.identifier = "Email or phone number is required";
  } else {
    try {
      determineLoginType(formData.identifier);
    } catch (error) {
      errors.identifier = "Please enter a valid email or phone number";
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors,
  };
};

export { apiClient };
