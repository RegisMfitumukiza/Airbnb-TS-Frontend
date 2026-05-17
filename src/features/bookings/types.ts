import type { Listing } from "../listings/types";
import type { User } from "../auth/types";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED";

export type Booking = {
  id: string;

  guestId: string;
  listingId: string;

  checkIn: string;
  checkOut: string;

  status: BookingStatus;

  createdAt: string;
  updatedAt?: string;

  guest?: User;

  listing?: Listing;
};

export type CreateBookingPayload = {
  listingId: string;
  checkIn: string;
  checkOut: string;
};