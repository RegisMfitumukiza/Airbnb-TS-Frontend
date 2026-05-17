export type AdminUserRoleCount = {
  role: string;
  count: number;
};

export type AdminListingTypeCount = {
  type: string;
  count: number;
};

export type AdminStats = {
  totalUsers: number;
  totalListings: number;
  totalBookings: number;
  totalHostRequests: number;
  pendingHostRequests: number;
  totalNotifications: number;
  usersByRole: AdminUserRoleCount[];
  listingsByType: AdminListingTypeCount[];
  averagePrice: number;
};

export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};