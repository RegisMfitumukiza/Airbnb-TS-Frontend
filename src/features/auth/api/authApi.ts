import api from "../../../lib/api";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../types";

type MeResponse = {
  success: boolean;
  data: User;
};

export async function loginUser(payload: LoginPayload) {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
}

export async function getMe() {
  const response = await api.get<MeResponse>("/auth/me");
  return response.data.data;
}

