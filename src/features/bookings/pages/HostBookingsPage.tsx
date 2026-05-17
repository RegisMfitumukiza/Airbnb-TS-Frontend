import { differenceInDays, format } from "date-fns";
import numeral from "numeral";
import { useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import { DashboardTopbar } from "../../../shared/components/DashboardTopbar";
import { Pagination } from "../../../shared/components/Pagination";
import { Spinner } from "../../../shared/components/Spinner";

import {
  useCancelBooking,
  useHostBookings,
  useUpdateBookingStatus,
} from "../hooks/useBookings";

export function HostBookingsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 5;

  const { data: bookings = [], isLoading } =
    useHostBookings();

  const updateStatus =
    useUpdateBookingStatus("host");

  const cancelBooking =
    useCancelBooking("host");

  const filteredBookings =
    useMemo(() => {
      const normalized =
        search.toLowerCase().trim();

      return bookings.filter(
        (booking) =>
          booking.status
            .toLowerCase()
            .includes(normalized) ||

          booking.guest?.name
            ?.toLowerCase()
            .includes(normalized) ||

          booking.guest?.email
            ?.toLowerCase()
            .includes(normalized) ||

          booking.listing?.title
            ?.toLowerCase()
            .includes(normalized) ||

          booking.listing?.location
            ?.toLowerCase()
            .includes(normalized)
      );
    }, [bookings, search]);

  const totalPages =
    Math.ceil(
      filteredBookings.length / limit
    ) || 1;

  const paginatedBookings =
    filteredBookings.slice(
      (page - 1) * limit,
      page * limit
    );

  if (isLoading) return <Spinner />;

  return (
    <>
      <DashboardTopbar
        title="Bookings"
        subtitle="Manage guest booking requests."
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
              Incoming bookings
            </h2>

            <p className="text-sm text-neutral-500">
              {filteredBookings.length} booking requests
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {paginatedBookings.map((booking) => {
            const nights =
              Math.max(
                differenceInDays(
                  new Date(
                    booking.checkOut
                  ),
                  new Date(
                    booking.checkIn
                  )
                ),
                1
              );

            const total =
              nights *
              (booking.listing
                ?.pricePerNight || 0);

            return (
              <article
                key={booking.id}
                className="rounded-[2rem] border border-neutral-200 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-neutral-950">
                      {booking.listing
                        ?.title ||
                        "Listing"}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                      <FaMapMarkerAlt className="text-rose-500" />
                      {booking.listing
                        ?.location}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <FaUser className="text-rose-500" />

                      <span className="font-bold">
                        {booking.guest
                          ?.name ||
                          "Guest"}
                      </span>

                      <span className="text-neutral-500">
                        •
                      </span>

                      <span className="text-neutral-500">
                        {booking.guest
                          ?.email ||
                          "No email"}
                      </span>
                    </div>
                  </div>

                  <StatusBadge
                    status={booking.status}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                  <span className="rounded-full bg-neutral-100 px-3 py-1">
                    {format(
                      new Date(
                        booking.checkIn
                      ),
                      "MMM d"
                    )}
                    {" → "}
                    {format(
                      new Date(
                        booking.checkOut
                      ),
                      "MMM d, yyyy"
                    )}
                  </span>

                  <span className="rounded-full bg-neutral-100 px-3 py-1">
                    {nights} nights
                  </span>

                  <span className="rounded-full bg-neutral-100 px-3 py-1">
                    {numeral(total).format(
                      "$0,0"
                    )}
                  </span>
                </div>

                {booking.status ===
                  "PENDING" && (
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() =>
                        updateStatus.mutate(
                          {
                            id: booking.id,
                            status:
                              "CONFIRMED",
                          }
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white"
                    >
                      <FaCheckCircle />
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        cancelBooking.mutate(
                          booking.id
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-rose-500"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </div>
                )}
              </article>
            );
          })}

          {filteredBookings.length ===
            0 && (
            <div className="rounded-3xl border border-dashed p-10 text-center text-neutral-500">
              No booking requests yet.
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "CONFIRMED"
      ? "bg-green-50 text-green-700"
      : status ===
          "CANCELLED"
        ? "bg-neutral-900 text-white"
        : "bg-rose-50 text-rose-500";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${styles}`}
    >
      {status}
    </span>
  );
}