import api from "../../../lib/api";
import type { User } from "../../auth/types";


type UserResponse = {
    success: boolean;
    message: string;
    data: User
};

export type UpdateAccountPayload = {
    name?: string;
    email?: string;
    username?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  newPassword: string;
  confirmNewPassword: string;
};

export async function updateMyAccount(payload: UpdateAccountPayload) {
    const response = await api.put<UserResponse>("/users/me", payload);
    return response.data.data;
}

export async function uploadMyAvatar(file:File) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<UserResponse>("/users/me/avatar", formData);
    return response.data.data;
}

export async function deletMyAvatar() {
    const response = await api.delete<UserResponse>("/users/me/avatar");
    return response.data.data;
}


export async function changePassword(payload:  ChangePasswordPayload) {
  const response = await api.post("/auth/change-password", payload);
  return response.data;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
}


export async function resetPassword(token: string, payload: ResetPasswordPayload) {
    const response = await api.post(`auth/reset-password/${token}`, payload);
    return response.data.data;
}


