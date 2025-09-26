import apiClient from "./client";
import { determineLoginType } from "../utils/validation.utils";

export const login = async (credentials) => {
  // Determine login type based on identifier format
  const loginType = determineLoginType(credentials.identifier);

  // Prepare payload for API
  const payload = {
    identifier: credentials.identifier,
    password: credentials.password,
    loginType: loginType,
    rememberMe: credentials.rememberMe || false,
  };

  const response = await apiClient.post("/api/user-profiles/login/", payload);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post(
    "/api/user-profiles/register/",
    userData,
  );
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get("/api/user-profiles/me/");
  return response.data;
};
