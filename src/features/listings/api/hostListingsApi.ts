import api from "../../../lib/api";
import type { Listing, ListingCategory, ListingType } from "../types";

export type CreateListingPayload = {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  pricePerNight: number;
  guests: number;
  type: ListingType;
  category: ListingCategory;
  amenities: string[];
  available: boolean;
  availableFrom?: string;
  superhost?: boolean;
};

type CreateListingResponse = {
  success: boolean;
  message: string;
  data: Listing;
};

type HostListingsResponse = {
  success: boolean;
  count: number;
  data: Listing[];
};

type DeleteListingResponse = {
  success: boolean;
  message: string;
  data: Listing;
};

export type UpdateListingPayload = Partial<CreateListingPayload>;

type UpdateListingResponse = {
  success: boolean;
  message: string;
  data: Listing;
};

export async function createListing(payload: CreateListingPayload) {
  const response = await api.post<CreateListingResponse>("/listings", payload);
  return response.data.data;
}

export async function getHostListings(hostId: string) {
  const response = await api.get<HostListingsResponse>(
    `/users/${hostId}/listings`
  );

  return response.data.data;
}

export async function deleteListing(id: string) {
  const response = await api.delete<DeleteListingResponse>(`/listings/${id}`);
  return response.data;
}

export async function updateListing(id: string, payload: UpdateListingPayload) {
  const response = await api.put<UpdateListingResponse>(
    `/listings/${id}`,
    payload
  );

  return response.data.data;
}