import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  updateListing,
  type UpdateListingPayload,
} from "../api/hostListingsApi";

type UpdateListingArgs = {
  id: string;
  payload: UpdateListingPayload;
};

export function useUpdateListing() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateListingArgs) =>
      updateListing(id, payload),
    onSuccess: (listing) => {
      toast.success("Listing updated successfully");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", listing.id] });
      queryClient.invalidateQueries({ queryKey: ["host-listings"] });
      navigate("/host/listings");
    },
    onError: () => {
      toast.error("Failed to update listing");
    },
  });
}