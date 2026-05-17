import api from "../../../lib/api";
import type { User } from "../../auth/types";
import type { Listing } from "../../listings/types";
import type { AdminNotification } from "../types";

type ListResponse<T> = {
  success: boolean;
  count?: number;
  data: T[];
};

type SingleResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UpdateAdminUserPayload = {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  role?: "GUEST" | "HOST" | "ADMIN";
  avatar?: string | null;
  bio?: string | null;
};

export async function getAdminUsers(): Promise<User[]> {
  const response = await api.get<ListResponse<User>>("/users");
  return response.data.data;
}

export async function updateAdminUser(
  id: string,
  payload: UpdateAdminUserPayload
): Promise<User> {
  const response = await api.put<SingleResponse<User>>(`/users/${id}`, payload);
  return response.data.data;
}

export async function deleteAdminUser(id: string): Promise<User> {
  const response = await api.delete<SingleResponse<User>>(`/users/${id}`);
  return response.data.data;
}

export async function getAdminListings(): Promise<Listing[]> {
  const response = await api.get<ListResponse<Listing>>("/listings");
  return response.data.data;
}

export async function deleteAdminListing(id: string): Promise<Listing> {
  const response = await api.delete<SingleResponse<Listing>>(`/listings/${id}`);
  return response.data.data;
}

export async function getAdminNotifications(): Promise<AdminNotification[]> {
  const response =
    await api.get<ListResponse<AdminNotification>>("/notifications");

  return response.data.data;
}

export async function markNotificationRead(id: string) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.patch("/notifications/read-all");
  return response.data;
}

export type BanUserPayload = {
  reason: string;
};

export async function banAdminUser(
  id: string,
  payload: BanUserPayload
): Promise<User> {
  const response = await api.post<SingleResponse<User>>(
    `/users/${id}/ban`,
    payload
  );

  return response.data.data;
}