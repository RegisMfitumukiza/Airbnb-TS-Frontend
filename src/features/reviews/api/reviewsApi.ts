import api from "../../../lib/api";
import type { Review } from "../types";

type ReviewsResponse = {
  success: boolean;
  count?: number;
  data: Review[];
};

type ReviewResponse = {
  success: boolean;
  message: string;
  data: Review;
};

export type CreateReviewPayload = {
  listingId: string;
  rating: number;
  comment: string;
};

export async function getAllReviews(): Promise<Review[]> {
  const response = await api.get<ReviewsResponse>("/reviews");
  return response.data.data;
}

export async function getListingReviews(listingId: string): Promise<Review[]> {
  const response = await api.get<ReviewsResponse>(
    `/listings/${listingId}/reviews`
  );

  return response.data.data;
}

export async function createReview(
  payload: CreateReviewPayload
): Promise<Review> {
  const response = await api.post<ReviewResponse>(
    `/listings/${payload.listingId}/reviews`,
    {
      rating: payload.rating,
      comment: payload.comment,
    }
  );

  return response.data.data;
}

export async function deleteReview(id: string): Promise<Review> {
  const response = await api.delete<ReviewResponse>(`/reviews/${id}`);
  return response.data.data;
}