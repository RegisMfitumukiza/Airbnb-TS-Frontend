import {
    differenceInCalendarDays,
    format,
    isAfter,
    startOfToday,
} from "date-fns";
import numeral from "numeral";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaCalendarCheck,
    FaEye,
    FaMapMarkerAlt,
    FaSearch,
    FaTimes,
} from "react-icons/fa";

import { Pagination } from "../../../shared/components/Pagination";
import { Spinner } from "../../../shared/components/Spinner";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCancelBooking, useMyBookings } from "../hooks/useBookings";
import type { Booking } from "../types";

type TripTab = "ALL" | "UPCOMING" | "PENDING" | "CANCELLED";

const tabs: Array<{ label: string; value: TripTab }> = [
    { label: "All", value: "ALL" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Pending", value: "PENDING" },
    { label: "Cancelled", value: "CANCELLED" },
];

export function MyBookingsPage() {
    const { user } = useAuth();

    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<TripTab>("ALL");
    const [page, setPage] = useState(1);

    const limit = 5;

    const { data: bookings = [], isLoading } = useMyBookings(user?.id);
    const cancelBooking = useCancelBooking("guest");

    const filteredBookings = useMemo(() => {
        const today = startOfToday();
        const normalized = search.toLowerCase().trim();

        return bookings
            .filter((booking) => {
                if (activeTab === "PENDING") return booking.status === "PENDING";
                if (activeTab === "CANCELLED") return booking.status === "CANCELLED";

                if (activeTab === "UPCOMING") {
                    return (
                        booking.status !== "CANCELLED" &&
                        isAfter(new Date(booking.checkIn), today)
                    );
                }

                return true;
            })
            .filter((booking) => {
                if (!normalized) return true;

                return (
                    booking.status.toLowerCase().includes(normalized) ||
                    booking.listing?.title?.toLowerCase().includes(normalized) ||
                    booking.listing?.location?.toLowerCase().includes(normalized)
                );
            });
    }, [bookings, activeTab, search]);

    const totalPages = Math.ceil(filteredBookings.length / limit) || 1;

    const paginatedBookings = filteredBookings.slice(
        (page - 1) * limit,
        page * limit
    );

    if (isLoading) return <Spinner />;

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <section className="mb-10">
                <h1 className="text-5xl font-black tracking-tight text-neutral-950">
                    Trips
                </h1>

                <p className="mt-3 text-lg text-neutral-500">
                    Your reservations and booking requests.
                </p>
            </section>

            <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => {
                                setActiveTab(tab.value);
                                setPage(1);
                            }}
                            className={`whitespace-nowrap rounded-full border px-5 py-3 text-sm font-bold transition ${activeTab === tab.value
                                ? "border-neutral-950 bg-neutral-950 text-white"
                                : "border-neutral-200 bg-white text-neutral-700 hover:border-rose-500 hover:text-rose-500"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <label className="flex w-full items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 shadow-sm transition focus-within:border-rose-500 lg:max-w-sm">
                    <FaSearch className="text-neutral-400" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Search trips..."
                        className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
                    />
                </label>
            </section>

            <section className="space-y-5">
                {paginatedBookings.map((booking) => (
                    <TripCard
                        key={booking.id}
                        booking={booking}
                        isCancelling={cancelBooking.isPending}
                        onCancel={() => cancelBooking.mutate(booking.id)}
                    />
                ))}

                {filteredBookings.length === 0 && <EmptyTrips activeTab={activeTab} />}

                {filteredBookings.length > 0 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
            </section>
        </main>
    );
}

type TripCardProps = {
    booking: Booking;
    isCancelling: boolean;
    onCancel: () => void;
};

function TripCard({ booking, isCancelling, onCancel }: TripCardProps) {
    const image =
        booking.listing?.coverImage ||
        booking.listing?.images?.[0] ||
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop";


    const nights = Math.max(
        differenceInCalendarDays(
            new Date(booking.checkOut),
            new Date(booking.checkIn)
        ),
        1
    );


    const total =
        nights * (booking.listing?.pricePerNight ?? 0);

    const canCancel = booking.status !== "CANCELLED";

    return (
        <article className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:shadow-xl hover:shadow-neutral-200/70">
            <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                <Link to={`/listings/${booking.listingId}`} className="block">
                    <img
                        src={image}
                        alt={booking.listing?.title || "Listing"}
                        className="h-64 w-full object-cover md:h-full"
                    />
                </Link>

                <div className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <StatusBadge status={booking.status} />

                            <h2 className="mt-4 text-2xl font-black text-neutral-950">
                                {booking.listing?.title || "Listing"}
                            </h2>

                            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500">
                                <FaMapMarkerAlt className="text-rose-500" />
                                {booking.listing?.location || "No location"}
                            </p>
                        </div>

                        <p className="text-xl font-black text-neutral-950">
                            {numeral(total).format("$0,0")}
                        </p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <TripInfo
                            label="Check-in"
                            value={format(new Date(booking.checkIn), "MMM d, yyyy")}
                        />

                        <TripInfo
                            label="Check-out"
                            value={format(new Date(booking.checkOut), "MMM d, yyyy")}
                        />

                        <TripInfo
                            label="Stay length"
                            value={`${nights} ${nights === 1 ? "night" : "nights"
                                }`}
                        />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            to={`/listings/${booking.listingId}`}
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-900 transition hover:border-rose-500 hover:text-rose-500"
                        >
                            <FaEye />
                            View stay
                        </Link>

                        {canCancel && (
                            <button
                                type="button"
                                disabled={isCancelling}
                                onClick={() => {
                                    if (!confirm("Cancel this trip?")) return;
                                    onCancel();
                                }}
                                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                            >
                                <FaTimes />
                                Cancel trip
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

function TripInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
                {label}
            </p>

            <p className="mt-1 font-bold text-neutral-900">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const className =
        status === "CONFIRMED"
            ? "bg-green-50 text-green-700"
            : status === "CANCELLED"
                ? "bg-neutral-950 text-white"
                : "bg-yellow-50 text-yellow-700";

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-black ${className}`}>
            {status}
        </span>
    );
}

function EmptyTrips({ activeTab }: { activeTab: TripTab }) {
    const message =
        activeTab === "UPCOMING"
            ? "You do not have upcoming trips yet."
            : activeTab === "PENDING"
                ? "You do not have pending booking requests."
                : activeTab === "CANCELLED"
                    ? "You do not have cancelled trips."
                    : "When you book a stay, it will appear here.";

    return (
        <div className="rounded-[2rem] border border-dashed border-neutral-300 p-14 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-2xl text-rose-500">
                <FaCalendarCheck />
            </div>

            <h2 className="mt-5 text-2xl font-black text-neutral-950">
                No trips found
            </h2>

            <p className="mt-3 text-neutral-500">{message}</p>

            <Link
                to="/listings"
                className="mt-6 inline-flex rounded-full bg-neutral-950 px-6 py-3 font-bold text-white transition hover:bg-rose-500"
            >
                Explore stays
            </Link>
        </div>
    );
}