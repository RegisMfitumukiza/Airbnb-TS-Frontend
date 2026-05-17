import api from "../../../lib/api";
import type { Listing } from "../types";

type ListingImageResponse = {
  success: boolean;
  message: string;
  data: Listing;
};

export async function uploadListingCoverImage(listingId: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<ListingImageResponse>(
    `/listings/${listingId}/cover-image`,
    formData
  );

  return response.data.data;
}

export async function uploadListingGalleryImages(
  listingId: string,
  files: File[]
) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post<ListingImageResponse>(
    `/listings/${listingId}/images`,
    formData
  );

  return response.data.data;
}

export async function deleteListingCoverImage(listingId: string) {
  const response = await api.delete<ListingImageResponse>(
    `/listings/${listingId}/cover-image`
  );

  return response.data.data;
}

export async function deleteAllListingImages(listingId: string) {
  const response = await api.delete<ListingImageResponse>(
    `/listings/${listingId}/images`
  );

  return response.data.data;
}

export async function deleteSingleListingImage(
  listingId: string,
  publicId: string
) {
  const encodedPublicId = encodeURIComponent(publicId);

  const response = await api.delete<ListingImageResponse>(
    `/listings/${listingId}/images/${encodedPublicId}`
  );

  return response.data.data;
}