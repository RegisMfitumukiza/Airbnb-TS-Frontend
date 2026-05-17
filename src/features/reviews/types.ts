import type { Listing } from "../listings/types";
import type { User } from "../auth/types";

export type Review = {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  listingId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  listing?: Listing;
};