import apiClient from "./client";

// Get all snacks
export const getAllUsers = async () => {
  const response = await apiClient.get("/api/user-profiles/");
  return response.data;
};
