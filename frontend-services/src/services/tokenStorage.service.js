// Handle all token storage operations in localStorage

const TOKEN_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

// get the tokens from the local storage
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = () => {
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

// set the tokens in the local storage
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
};

// clear the tokens from the local storage
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

// check if the token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));

    const expirationTime = decodedPayload.exp * 1000; // convert seconds to milliseconds
    const currentTime = Date.now();

    return currentTime >= expirationTime - 60000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const hasValidToken = () => {
  const accessToken = getAccessToken();
  return accessToken && !isTokenExpired(accessToken);
};
