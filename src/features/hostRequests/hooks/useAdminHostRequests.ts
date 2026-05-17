import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  approveHostRequest,
  getHostRequests,
  rejectHostRequest,
} from "../api/adminHostRequestsApi";
import type { HostRequestStatus } from "../types";

export function useAdminHostRequests(status?: HostRequestStatus) {
  return useQuery({
    queryKey: ["admin-host-requests", status],
    queryFn: () => getHostRequests(status),
  });
}

export function useApproveHostRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveHostRequest(id),
    onSuccess: () => {
      toast.success("Host request approved");
      queryClient.invalidateQueries({ queryKey: ["admin-host-requests"] });
    },
    onError: () => {
      toast.error("Failed to approve request");
    },
  });
}

export function useRejectHostRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectHostRequest(id, reason),
    onSuccess: () => {
      toast.success("Host request rejected");
      queryClient.invalidateQueries({ queryKey: ["admin-host-requests"] });
    },
    onError: () => {
      toast.error("Failed to reject request");
    },
  });
}