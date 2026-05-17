import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { differenceInDays, format } from "date-fns";
import numeral from "numeral";
import { useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaEye,
  FaMapMarkerAlt,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import { DashboardTopbar } from "../../../shared/components/DashboardTopbar";
import { Pagination } from "../../../shared/components/Pagination";
import { Spinner } from "../../../shared/components/Spinner";
import {
  useAllBookings,
  useDeleteBooking,
  useUpdateBookingStatus,
} from "../hooks/useBookings";
import type { Booking, BookingStatus } from "../types";

export function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusTarget, setStatusTarget] = useState<Booking | null>(null);
  const [nextStatus, setNextStatus] = useState<BookingStatus>("PENDING");
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);

  const limit = 6;

  const { data: bookings = [], isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus("admin");
  const deleteBooking = useDeleteBooking();

  const filteredBookings = useMemo(() => {
    const normalized = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      return (
        booking.status.toLowerCase().includes(normalized) ||
        booking.guest?.name?.toLowerCase().includes(normalized) ||
        booking.guest?.email?.toLowerCase().includes(normalized) ||
        booking.listing?.title?.toLowerCase().includes(normalized) ||
        booking.listing?.location?.toLowerCase().includes(normalized)
      );
    });
  }, [bookings, search]);

  const totalPages = Math.ceil(filteredBookings.length / limit) || 1;

  const paginatedBookings = filteredBookings.slice(
    (page - 1) * limit,
    page * limit
  );

  if (isLoading) return <Spinner />;

  return (
    <>
      <DashboardTopbar
        title="Bookings"
        subtitle="Review and manage all platform reservations."
        searchValue={search}
        searchPlaceholder="Search bookings..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-500">
            <FaCalendarCheck />
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-950">
              Platform bookings
            </h2>
            <p className="text-sm text-neutral-500">
              {filteredBookings.length} bookings found
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {paginatedBookings.map((booking) => {
            const nights = Math.max(
              differenceInDays(
                new Date(booking.checkOut),
                new Date(booking.checkIn)
              ),
              1
            );

            const total = nights * (booking.listing?.pricePerNight ?? 0);

            return (
              <article
                key={booking.id}
                className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-neutral-200/70"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={booking.status} />

                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600">
                        {format(new Date(booking.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black text-neutral-950">
                      {booking.listing?.title || "Listing"}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500">
                      <FaMapMarkerAlt className="text-rose-500" />
                      {booking.listing?.location || "No location"}
                    </p>

                    <div className="mt-4 flex items-center gap-3 rounded-3xl bg-neutral-50 p-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-rose-500">
                        <FaUser />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-neutral-950">
                          {booking.guest?.name || "Guest"}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {booking.guest?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm font-bold text-neutral-700 sm:grid-cols-3 lg:min-w-[360px]">
                    <InfoPill
                      label="Dates"
                      value={`${format(new Date(booking.checkIn), "MMM d")} → ${format(
                        new Date(booking.checkOut),
                        "MMM d, yyyy"
                      )}`}
                    />

                    <InfoPill
                      label="Nights"
                      value={`${nights} ${nights === 1 ? "night" : "nights"}`}
                    />

                    <InfoPill
                      label="Total"
                      value={numeral(total).format("$0,0")}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(booking)}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-800 transition hover:border-rose-500 hover:text-rose-500"
                  >
                    <FaEye />
                    View
                  </button>

                  <select
                    value={booking.status}
                    disabled={updateStatus.isPending}
                    onChange={(event) => {
                      const status = event.target.value as BookingStatus;

                      if (status === booking.status) return;

                      setStatusTarget(booking);
                      setNextStatus(status);
                    }}
                    className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-800 outline-none transition hover:border-rose-500 focus:border-rose-500 disabled:opacity-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <button
                    type="button"
                    disabled={deleteBooking.isPending}
                    onClick={() => setDeleteTarget(booking)}
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredBookings.length === 0 && (
          <div className="rounded-3xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
            No bookings found.
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>

      <Dialog
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 grid place-items-center p-4">
          <DialogPanel className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <DialogTitle className="text-2xl font-black text-neutral-950">
                Booking details
              </DialogTitle>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 transition hover:bg-rose-500 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            {selectedBooking && (
              <BookingDetails booking={selectedBooking} />
            )}
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 grid place-items-center p-4">
          <DialogPanel className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <DialogTitle className="text-2xl font-black text-neutral-950">
              Update booking status?
            </DialogTitle>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              This will change the booking status for{" "}
              <strong>{statusTarget?.guest?.email || "this guest"}</strong> to{" "}
              <strong>{nextStatus}</strong>.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="flex-1 rounded-2xl border border-neutral-200 px-5 py-3 font-bold transition hover:border-rose-500 hover:text-rose-500"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={updateStatus.isPending || !statusTarget}
                onClick={() => {
                  if (!statusTarget) return;

                  updateStatus.mutate(
                    {
                      id: statusTarget.id,
                      status: nextStatus,
                    },
                    {
                      onSuccess: () => setStatusTarget(null),
                    }
                  );
                }}
                className="flex-1 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 grid place-items-center p-4">
          <DialogPanel className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <DialogTitle className="text-2xl font-black text-neutral-950">
              Delete booking?
            </DialogTitle>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              This action removes the booking record. This should only be used
              for cleanup or invalid records.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-2xl border border-neutral-200 px-5 py-3 font-bold transition hover:border-rose-500 hover:text-rose-500"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteBooking.isPending || !deleteTarget}
                onClick={() => {
                  if (!deleteTarget) return;

                  deleteBooking.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  });
                }}
                className="flex-1 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

function BookingDetails({ booking }: { booking: Booking }) {
  const nights = Math.max(
    differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn)),
    1
  );

  const total = nights * (booking.listing?.pricePerNight ?? 0);

  return (
    <div className="space-y-4">
      <DetailBox
        label="Guest"
        value={`${booking.guest?.name || "Guest"} • ${
          booking.guest?.email || "No email"
        }`}
      />

      <DetailBox
        label="Listing"
        value={`${booking.listing?.title || "Listing"} • ${
          booking.listing?.location || "No location"
        }`}
      />

      <DetailBox
        label="Check-in"
        value={format(new Date(booking.checkIn), "MMM d, yyyy")}
      />

      <DetailBox
        label="Check-out"
        value={format(new Date(booking.checkOut), "MMM d, yyyy")}
      />

      <DetailBox
        label="Nights"
        value={`${nights} ${nights === 1 ? "night" : "nights"}`}
      />

      <DetailBox label="Status" value={booking.status} />

      <DetailBox label="Total price" value={numeral(total).format("$0,0")} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "CONFIRMED"
      ? "bg-green-50 text-green-700"
      : status === "CANCELLED"
        ? "bg-neutral-950 text-white"
        : "bg-rose-50 text-rose-500";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {status}
    </span>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-1 font-black text-neutral-950">{value}</p>
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-neutral-800">{value}</p>
    </div>
  );
}