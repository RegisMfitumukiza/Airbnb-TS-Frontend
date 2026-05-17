export type Role = "GUEST" | "HOST" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: Role;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  superhost?: boolean;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  data: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
};