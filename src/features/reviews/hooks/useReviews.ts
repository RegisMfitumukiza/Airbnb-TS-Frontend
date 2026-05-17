import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createReview,
  deleteReview,
  getAllReviews,
  getListingReviews,
} from "../api/reviewsApi";

export function useAllReviews() {
  return useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: getAllReviews,
  });
}

export function useListingReviews(listingId?: string) {
  return useQuery({
    queryKey: ["reviews", listingId],
    queryFn: () => getListingReviews(listingId!),
    enabled: Boolean(listingId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (review) => {
      toast.success("Review submitted");
      queryClient.invalidateQueries({
        queryKey: ["reviews", review.listingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["listing", review.listingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["listings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "reviews"],
      });
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({
        queryKey: ["admin", "reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listings"],
      });
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });
}