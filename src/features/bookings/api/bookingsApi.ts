import api from "../../../lib/api";
import type {
  Booking,
  BookingStatus,
  CreateBookingPayload,
} from "../types";

type ListResponse<T> = {
  success: boolean;
  count?: number;
  data: T[];
};

type SingleResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function createBooking(
  payload: CreateBookingPayload
): Promise<Booking> {
  const response = await api.post<SingleResponse<Booking>>(
    "/bookings",
    payload
  );

  return response.data.data;
}

export async function getAllBookings(): Promise<Booking[]> {
  const response =
    await api.get<ListResponse<Booking>>(
      "/bookings"
    );

  return response.data.data;
}

export async function getMyBookings(
  userId: string
): Promise<Booking[]> {
  const response =
    await api.get<ListResponse<Booking>>(
      `/users/${userId}/bookings`
    );

  return response.data.data;
}

export async function getHostBookings(): Promise<Booking[]> {
  const response =
    await api.get<ListResponse<Booking>>(
      "/bookings/host"
    );

  return response.data.data;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  const response =
    await api.patch<SingleResponse<Booking>>(
      `/bookings/${id}/status`,
      { status }
    );

  return response.data.data;
}

export async function cancelBooking(
  id: string
): Promise<Booking> {
  const response =
    await api.patch<SingleResponse<Booking>>(
      `/bookings/${id}/status`,
      {
        status: "CANCELLED",
      }
    );

  return response.data.data;
}

export async function deleteBooking(
  id: string
): Promise<Booking> {
  const response =
    await api.delete<SingleResponse<Booking>>(
      `/bookings/${id}`
    );

  return response.data.data;
}