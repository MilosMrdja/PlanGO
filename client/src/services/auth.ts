import { apiCall } from "./api";
import type { AuthResponse } from "../types/AuthResponse";

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  return apiCall("api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  age: number
): Promise<AuthResponse> => {
  return apiCall("api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName, age }),
  });
};
