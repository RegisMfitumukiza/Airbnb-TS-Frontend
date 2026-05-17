import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { createListing, type CreateListingPayload } from "../api/hostListingsApi";

export function useCreateListing() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateListingPayload) => createListing(payload),
    onSuccess: (listing) => {
      toast.success("Listing created successfully");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate(`/host/listings/${listing.id}/images`);
    },
    onError: () => {
      toast.error("Failed to create listing");
    },
  });
}