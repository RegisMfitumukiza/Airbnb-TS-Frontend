import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createHostRequest,
  getMyHostRequests,
} from "../api/hostRequestsApi";
import type { CreateHostRequestPayload } from "../types";

export function useMyHostRequests() {
  return useQuery({
    queryKey: ["my-host-requests"],
    queryFn: getMyHostRequests,
  });
}

export function useCreateHostRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHostRequestPayload) =>
      createHostRequest(payload),
    onSuccess: () => {
      toast.success("Host request submitted");
      queryClient.invalidateQueries({ queryKey: ["my-host-requests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to submit host request");
    },
  });
}