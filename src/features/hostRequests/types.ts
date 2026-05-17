import type { User } from "../auth/types";

export type HostRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type HostRequest = {
  id: string;
  message: string | null;
  status: HostRequestStatus;
  userId: string;
  reviewedById: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
};

export type CreateHostRequestPayload = {
  message?: string;
};