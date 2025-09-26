import apiClient from "./client";

export const getActiveSessions = async () => {
  const response = await apiClient.get("/api/gaming-sessions/active/");
  return response.data;
};

export const getPastSessions = async () => {
  const response = await apiClient.get("/api/gaming-sessions/past/");
  return response.data;
};

export const pauseSession = async (sessionId) => {
  const response = await apiClient.put(
    `/api/gaming-sessions/${sessionId}/pause/`,
  );
  return response.data;
};

export const resumeSession = async (sessionId) => {
  const response = await apiClient.put(
    `/api/gaming-sessions/${sessionId}/resume/`,
  );
  return response.data;
};

export const endSession = async (sessionId) => {
  const response = await apiClient.put(
    `/api/gaming-sessions/${sessionId}/end/`,
  );
  return response.data;
};

export const addTimeToSession = async (sessionId, additionalMinutes) => {
  const response = await apiClient.put(
    `/api/gaming-sessions/${sessionId}/add-time/`,
    {
      additional_minutes: additionalMinutes,
    },
  );
  return response.data;
};

export const addItemToSession = async (sessionId, itemData) => {
  const response = await apiClient.post(
    `/api/gaming-sessions/${sessionId}/add-item/`,
    itemData,
  );
  return response.data;
};

export const getSessionDetails = async (sessionId) => {
  const response = await apiClient.get(`/api/gaming-sessions/${sessionId}/`);
  return response.data;
};
