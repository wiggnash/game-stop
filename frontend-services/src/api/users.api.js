import apiClient from "./client";

// Get all users
export const getAllUsers = async () => {
  const response = await apiClient.get("/api/user-profiles/");
  return response.data;
};

// Get all users with filters
export const getUsersWithFilters = async (searchTerm) => {
  const response = await apiClient.get(
    `/api/user-profiles/?search=${searchTerm}`,
  );
  return response.data;
};

// Create a user from the user management page
export const createUserByAdmin = async (userData) => {
  const response = await apiClient.post(`/api/user-profiles/create/`, userData);
  return response.data;
};
