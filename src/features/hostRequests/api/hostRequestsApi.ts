import api from "../../../lib/api";
import type { CreateHostRequestPayload, HostRequest } from "../types";

type HostRequestListResponse = {
  success: boolean;
  count: number;
  data: HostRequest[];
};

type HostRequestResponse = {
  success: boolean;
  message: string;
  data: HostRequest;
};

export async function getMyHostRequests() {
  const response = await api.get<HostRequestListResponse>("/host-requests/me");
  return response.data.data;
}

export async function createHostRequest(payload: CreateHostRequestPayload) {
  const response = await api.post<HostRequestResponse>(
    "/host-requests",
    payload
  );

  return response.data.data;
}