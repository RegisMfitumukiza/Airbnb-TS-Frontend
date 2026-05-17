import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  banAdminUser,
  type BanUserPayload,
} from "../api/adminManagementApi";

type BanUserArgs = {
  id: string;
  payload: BanUserPayload;
};

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: BanUserArgs) => banAdminUser(id, payload),
    onSuccess: () => {
      toast.success("User banned successfully");

      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["host", "listings"] });

      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["host", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["guest", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });

      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: () => {
      toast.error("Failed to ban user");
    },
  });
}