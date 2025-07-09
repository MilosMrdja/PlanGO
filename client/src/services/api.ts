export const API_BASE_URL = "https://localhost:7249/";

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // cookies
  };

  const response = await fetch(url, config as RequestInit);

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch (e) {
      error = { message: "API call failed" };
    }
    //console.error(error);
    throw new Error(error.message || "API call failed");
  }
  if (response.status === 204) {
    return null;
  }

  return response.json();
};
