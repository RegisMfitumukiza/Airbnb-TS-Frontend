import api from "../../../lib/api";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

type BackendNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
};

type ListResponse<T> = {
  success: boolean;
  count?: number;
  data: T[];
};

type UnreadCountResponse = {
  success: boolean;
  count?: number;
  unreadCount?: number;
  data?: {
    count?: number;
    unreadCount?: number;
  };
};

export async function getNotifications(): Promise<Notification[]> {
  const response =
    await api.get<ListResponse<BackendNotification>>("/notifications");

  return response.data.data.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    isRead: notification.read,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  }));
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await api.get<UnreadCountResponse>(
    "/notifications/unread-count"
  );

  return (
    response.data.unreadCount ??
    response.data.count ??
    response.data.data?.unreadCount ??
    response.data.data?.count ??
    0
  );
}

export async function markNotificationRead(id: string) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.patch("/notifications/read-all");
  return response.data;
}