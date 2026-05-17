import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  deleteAllListingImages,
  deleteListingCoverImage,
  deleteSingleListingImage,
  uploadListingCoverImage,
  uploadListingGalleryImages,
} from "../api/listingImageApi";

function useRefreshListingImages(listingId: string) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
    queryClient.invalidateQueries({ queryKey: ["listings"] });
    queryClient.invalidateQueries({ queryKey: ["host-listings"] });
  };
}

export function useUploadListingCoverImage(listingId: string) {
  const refresh = useRefreshListingImages(listingId);

  return useMutation({
    mutationFn: (file: File) => uploadListingCoverImage(listingId, file),
    onSuccess: () => {
      toast.success("Cover image uploaded");
      refresh();
    },
    onError: () => {
      toast.error("Failed to upload cover image");
    },
  });
}

export function useUploadListingGalleryImages(listingId: string) {
  const refresh = useRefreshListingImages(listingId);

  return useMutation({
    mutationFn: (files: File[]) => uploadListingGalleryImages(listingId, files),
    onSuccess: () => {
      toast.success("Gallery images uploaded");
      refresh();
    },
    onError: () => {
      toast.error("Failed to upload gallery images");
    },
  });
}

export function useDeleteListingCoverImage(listingId: string) {
  const refresh = useRefreshListingImages(listingId);

  return useMutation({
    mutationFn: () => deleteListingCoverImage(listingId),
    onSuccess: () => {
      toast.success("Cover image deleted");
      refresh();
    },
    onError: () => {
      toast.error("Failed to delete cover image");
    },
  });
}

export function useDeleteAllListingImages(listingId: string) {
  const refresh = useRefreshListingImages(listingId);

  return useMutation({
    mutationFn: () => deleteAllListingImages(listingId),
    onSuccess: () => {
      toast.success("Gallery images deleted");
      refresh();
    },
    onError: () => {
      toast.error("Failed to delete gallery images");
    },
  });
}

export function useDeleteSingleListingImage(listingId: string) {
  const refresh = useRefreshListingImages(listingId);

  return useMutation({
    mutationFn: (publicId: string) =>
      deleteSingleListingImage(listingId, publicId),
    onSuccess: () => {
      toast.success("Image deleted");
      refresh();
    },
    onError: () => {
      toast.error("Failed to delete image");
    },
  });
}