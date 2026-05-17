import api from "../../../lib/api";
import type { HostRequest, HostRequestStatus } from "../types";

type HostRequestListResponse = {
  success: boolean;
  count: number;
  data: HostRequest[];
};

type HostRequestActionResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

export async function getHostRequests(status?: HostRequestStatus) {
  const response = await api.get<HostRequestListResponse>("/host-requests", {
    params: status ? { status } : undefined,
  });

  return response.data.data;
}

export async function approveHostRequest(id: string) {
  const response = await api.patch<HostRequestActionResponse>(
    `/host-requests/${id}/approve`
  );

  return response.data;
}

export async function rejectHostRequest(id: string, reason?: string) {
  const response = await api.patch<HostRequestActionResponse>(
    `/host-requests/${id}/reject`,
    { reason }
  );

  return response.data;
}