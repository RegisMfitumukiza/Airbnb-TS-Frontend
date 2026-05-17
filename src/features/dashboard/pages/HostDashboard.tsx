import { Link } from "react-router-dom";
import {
    FaCalendarCheck,
    FaCheckCircle,
    FaClipboardList,
    FaHome,
    FaList,
    FaPlus,
    FaStar,
} from "react-icons/fa";

import { useAuth } from "../../auth/hooks/useAuth";
import { useHostListings } from "../../listings/hooks/useHostListings";
import { useHostBookings } from "../../bookings/hooks/useBookings";
import { Spinner } from "../../../shared/components/Spinner";

export function HostDashboard() {
    const { user } = useAuth();

    const { data: listings = [], isLoading: listingsLoading } = useHostListings(
        user?.id
    );

    const { data: bookings = [], isLoading: bookingsLoading } =
        useHostBookings();

    if (listingsLoading || bookingsLoading) return <Spinner />;

    const availableListings = listings.filter((listing) => listing.available);

    const pendingBookings = bookings.filter(
        (booking) => booking.status === "PENDING"
    );

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "CONFIRMED"
    );

    const ratedListings = listings.filter(
        (listing) => listing.rating !== null && listing.rating !== undefined
    );

    const averageRating =
        ratedListings.length > 0
            ? ratedListings.reduce(
                (sum, listing) => sum + Number(listing.rating),
                0
            ) / ratedListings.length
            : 0;

    const recentListings = listings.slice(0, 3);
    const recentBookings = bookings.slice(0, 3);

    const firstListing = listings[0];

    const managePhotosLink = firstListing
        ? `/host/listings/${firstListing.id}/images`
        : "/host/listings";

    return (
        <main className="space-y-8">
            <section className="rounded-[2rem] bg-neutral-950 p-10 text-white">
                <p className="text-sm font-extrabold uppercase tracking-wide text-rose-400">
                    Host dashboard
                </p>

                <h1 className="mt-3 text-4xl font-black">
                    Welcome, {user?.name || "Host"}
                </h1>

                <p className="mt-3 max-w-2xl text-neutral-300">
                    Manage your listings, review guest bookings, and keep your hosting
                    profile active.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        to="/host/listings/create"
                        className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 font-bold text-white transition hover:bg-rose-600"
                    >
                        <FaPlus />
                        Create listing
                    </Link>

                    <Link
                        to="/host/bookings"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-neutral-950 transition hover:bg-rose-50"
                    >
                        <FaCalendarCheck />
                        View bookings
                    </Link>
                </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    icon={<FaHome />}
                    label="Total listings"
                    value={listings.length}
                />

                <StatCard
                    icon={<FaCheckCircle />}
                    label="Available listings"
                    value={availableListings.length}
                />

                <StatCard
                    icon={<FaClipboardList />}
                    label="Pending bookings"
                    value={pendingBookings.length}
                />

                <StatCard
                    icon={<FaCalendarCheck />}
                    label="Confirmed bookings"
                    value={confirmedBookings.length}
                />

                <StatCard
                    icon={<FaStar />}
                    label="Average rating"
                    value={averageRating ? averageRating.toFixed(1) : "New"}
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-neutral-950">
                                Recent listings
                            </h2>
                            <p className="text-sm text-neutral-500">
                                Your latest hosting properties.
                            </p>
                        </div>

                        <Link
                            to="/host/listings"
                            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentListings.length > 0 ? (
                            recentListings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    to={`/host/listings/${listing.id}`}
                                    className="flex items-center gap-4 rounded-2xl border border-neutral-100 p-3 transition hover:border-rose-200 hover:bg-rose-50/40"
                                >
                                    <img
                                        src={
                                            listing.coverImage ||
                                            listing.images?.[0] ||
                                            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&auto=format&fit=crop"
                                        }
                                        alt={listing.title}
                                        className="h-16 w-20 rounded-2xl object-cover"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-black text-neutral-950">
                                            {listing.title}
                                        </p>
                                        <p className="text-sm text-neutral-500">
                                            {listing.location}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-black ${listing.available
                                                ? "bg-green-50 text-green-700"
                                                : "bg-neutral-950 text-white"
                                            }`}
                                    >
                                        {listing.available ? "Available" : "Unavailable"}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <EmptyState
                                title="No listings yet"
                                description="Create your first listing and start hosting guests."
                                actionLabel="Create listing"
                                to="/host/listings/create"
                            />
                        )}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-neutral-950">
                                Recent bookings
                            </h2>
                            <p className="text-sm text-neutral-500">
                                Latest guest reservations.
                            </p>
                        </div>

                        <Link
                            to="/host/bookings"
                            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentBookings.length > 0 ? (
                            recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="rounded-2xl border border-neutral-100 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-black text-neutral-950">
                                                {booking.listing?.title || "Listing"}
                                            </p>
                                            <div className="mt-1 text-sm text-neutral-500">
                                                <p>
                                                    Guest: {booking.guest?.name || "Guest"}
                                                </p>

                                                <p className="text-xs">
                                                    {booking.guest?.email || "No email"}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-black ${booking.status === "CONFIRMED"
                                                    ? "bg-green-50 text-green-700"
                                                    : booking.status === "CANCELLED"
                                                        ? "bg-neutral-950 text-white"
                                                        : "bg-yellow-50 text-yellow-700"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState
                                title="No bookings yet"
                                description="Bookings will appear here when guests reserve your listings."
                                actionLabel="View listings"
                                to="/host/listings"
                            />
                        )}
                    </div>
                </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
                <QuickAction
                    icon={<FaPlus />}
                    title="Create a new listing"
                    description="Add another property to your hosting account."
                    to="/host/listings/create"
                />

                <QuickAction
                    icon={<FaList />}
                    title="Manage listing photos"
                    description={
                        firstListing
                            ? "Go directly to your listing image manager."
                            : "Create a listing first, then upload professional photos."
                    }
                    to={managePhotosLink}
                />
            </section>
        </main>
    );
}

type StatCardProps = {
    icon: React.ReactNode;
    label: string;
    value: number | string;
};

function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-xl text-rose-500">
                {icon}
            </div>

            <p className="mt-5 text-sm font-bold text-neutral-500">{label}</p>
            <p className="mt-2 text-4xl font-black text-neutral-950">{value}</p>
        </div>
    );
}

type QuickActionProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    to: string;
};

function QuickAction({ icon, title, description, to }: QuickActionProps) {
    return (
        <Link
            to={to}
            className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl hover:shadow-neutral-200/70"
        >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-xl text-rose-500">
                {icon}
            </div>

            <h2 className="mt-5 text-xl font-black text-neutral-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
        </Link>
    );
}

type EmptyStateProps = {
    title: string;
    description: string;
    actionLabel: string;
    to: string;
};

function EmptyState({ title, description, actionLabel, to }: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center">
            <h3 className="font-black text-neutral-950">{title}</h3>
            <p className="mt-2 text-sm text-neutral-500">{description}</p>

            <Link
                to={to}
                className="mt-4 inline-flex rounded-full bg-neutral-950 px-5 py-2 text-sm font-bold text-white transition hover:bg-rose-500"
            >
                {actionLabel}
            </Link>
        </div>
    );
}