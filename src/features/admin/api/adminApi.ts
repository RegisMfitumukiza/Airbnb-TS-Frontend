import api from "../../../lib/api";
import type { AdminStats } from "../types";

type UserStatsResponse = {
  success: boolean;
  data: {
    totalUsers: number;
    usersByRole: Array<{
      role: string;
      count: number;
    }>;
  };
};

type ListingStatsResponse = {
  success: boolean;
  data: {
    totalListings: number;
    averagePricePerNight?: number;
    listingsByType?: Array<{
      type: string;
      count: number;
    }>;
  };
};

type CountResponse<T> = {
  success: boolean;
  count?: number;
  data: T[];
};

export async function getAdminStats(): Promise<AdminStats> {
  const [
    usersRes,
    listingsRes,
    bookingsRes,
    hostRequestsRes,
    notificationsRes,
    pendingHostRequestsRes,
  ] = await Promise.all([
    api.get<UserStatsResponse>("/users/stats"),
    api.get<ListingStatsResponse>("/listings/stats"),
    api.get<CountResponse<unknown>>("/bookings"),
    api.get<CountResponse<unknown>>("/host-requests"),
    api.get<CountResponse<unknown>>("/notifications"),
    api.get<PendingHostRequestsResponse>("/host-requests/pending/count"),
  ]);

  return {
    totalUsers: usersRes.data.data.totalUsers,
    totalListings: listingsRes.data.data.totalListings,
    totalBookings:
      bookingsRes.data.count ?? bookingsRes.data.data?.length ?? 0,
    totalHostRequests:
      hostRequestsRes.data.count ?? hostRequestsRes.data.data?.length ?? 0,
    pendingHostRequests: pendingHostRequestsRes.data.data.count,
    totalNotifications:
      notificationsRes.data.count ?? notificationsRes.data.data?.length ?? 0,
    usersByRole: usersRes.data.data.usersByRole,
    listingsByType: listingsRes.data.data.listingsByType ?? [],
    averagePrice: listingsRes.data.data.averagePricePerNight ?? 0,
  };
}

type PendingHostRequestsResponse = {
  success: boolean;
  data: {
    count: number;
  };
};

export async function getPendingHostRequestsCount(): Promise<number> {
  const response = await api.get<PendingHostRequestsResponse>(
    "/host-requests/pending/count"
  );

  return response.data.data.count;
}