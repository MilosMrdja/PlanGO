export const API_BASE_URL = "https://localhost:7249/";

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // Always include cookies
    ...options,
  };

  const response = await fetch(url, config as RequestInit);

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch (e) {
      error = { message: "API call failed" };
    }
    console.error(error);
    throw new Error(error.message || "API call failed");
  }
  return response.json();
};
