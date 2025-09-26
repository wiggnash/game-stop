import apiClient from "./client";

// Get all snacks
export const getAllSnacks = async () => {
  const response = await apiClient.get("/api/snacks/");
  return response.data;
};

// Create a new snack
export const createSnack = async (snackData) => {
  const response = await apiClient.post("/api/snacks/", snackData);
  return response.data;
};

// Update a snack
export const updateSnack = async (snackId, snackData) => {
  const response = await apiClient.put(`/api/snacks/${snackId}/`, snackData);
  return response.data;
};

// Delete a snack
export const deleteSnack = async (snackId) => {
  const response = await apiClient.delete(`/api/snacks/${snackId}/`);
  return response.data;
};

// Get a single snack by ID
export const getSnackById = async (snackId) => {
  const response = await apiClient.get(`/api/snacks/${snackId}/`);
  return response.data;
};
