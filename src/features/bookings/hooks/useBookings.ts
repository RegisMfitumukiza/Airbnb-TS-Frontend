import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import {
  cancelBooking,
  createBooking,
  deleteBooking,
  getAllBookings,
  getHostBookings,
  getMyBookings,
  updateBookingStatus,
} from "../api/bookingsApi";
import type { BookingStatus, CreateBookingPayload } from "../types";

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      fallback
    );
  }

  return fallback;
}

const refreshBookingQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({ queryKey: ["bookings"] });
  queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
  queryClient.invalidateQueries({ queryKey: ["guest", "bookings"] });
  queryClient.invalidateQueries({ queryKey: ["host", "bookings"] });
  queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
  queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
};

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      toast.success("Booking request created");
      refreshBookingQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create booking"));
    },
  });
}

export function useMyBookings(userId?: string) {
  return useQuery({
    queryKey: ["guest", "bookings", userId],
    queryFn: () => getMyBookings(userId!),
    enabled: Boolean(userId),
  });
}

export function useHostBookings() {
  return useQuery({
    queryKey: ["host", "bookings"],
    queryFn: getHostBookings,
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: getAllBookings,
  });
}

export function useUpdateBookingStatus(_scope?: "host" | "admin") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateBookingStatus(id, status),
    onSuccess: () => {
      toast.success("Booking status updated");
      refreshBookingQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update booking status"));
    },
  });
}

export function useCancelBooking(_scope?: "guest" | "host") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      toast.success("Booking cancelled");
      refreshBookingQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to cancel booking"));
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      toast.success("Booking deleted");
      refreshBookingQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete booking"));
    },
  });
}