import apiClient from "./client";

export const getAllRoles = async () => {
  const response = await apiClient.get("/api/roles/");
  return response.data;
};
