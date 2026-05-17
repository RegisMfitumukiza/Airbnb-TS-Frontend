import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { format } from "date-fns";
import numeral from "numeral";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaMapMarkerAlt,
  FaPlus,
  FaStar,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import { DashboardTopbar } from "../../../shared/components/DashboardTopbar";
import { Pagination } from "../../../shared/components/Pagination";
import { Spinner } from "../../../shared/components/Spinner";
import { useAuth } from "../../auth/hooks/useAuth";
import type { Listing } from "../types";
import { useDeleteListing } from "../hooks/useDeleteListing";
import { useHostListings } from "../hooks/useHostListings";

export function HostListingsPage() {
  const { user } = useAuth();

  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 4;

  const { data: listings = [], isLoading, isError } = useHostListings(user?.id);
  const deleteListing = useDeleteListing();

  const filteredListings = useMemo(() => {
    const normalized = search.toLowerCase().trim();

    return listings.filter((listing) => {
      return (
        listing.title.toLowerCase().includes(normalized) ||
        listing.location.toLowerCase().includes(normalized) ||
        listing.type.toLowerCase().includes(normalized) ||
        listing.category.toLowerCase().includes(normalized)
      );
    });
  }, [listings, search]);

  const totalPages = Math.ceil(filteredListings.length / limit) || 1;
  const paginatedListings = filteredListings.slice(
    (page - 1) * limit,
    page * limit
  );

  if (isLoading) return <Spinner />;

  return (
    <>
      <DashboardTopbar
        title="My Listings"
        subtitle="Manage your properties, upload images, and control your hosting content."
        searchValue={search}
        searchPlaceholder="Search my listings..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <section className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-rose-500">
            Host
          </p>

          <h1 className="mt-1 text-3xl font-black text-neutral-950">
            Listing management
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {filteredListings.length} listings found
          </p>
        </div>

        <Link
          to="/host/listings/create"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3 font-bold text-white transition hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-300"
        >
          <FaPlus />
          Create Listing
        </Link>
      </section>

      {isError ? (
        <section className="rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center font-semibold text-rose-600">
          Failed to load your listings.
        </section>
      ) : filteredListings.length === 0 ? (
        <section className="rounded-[2rem] border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-neutral-950">
            No listings found
          </h2>

          <p className="mt-3 text-neutral-500">
            Create your first listing or search using another keyword.
          </p>

          <Link
            to="/host/listings/create"
            className="mt-6 inline-flex rounded-full bg-rose-500 px-6 py-3 font-bold text-white transition hover:bg-rose-600"
          >
            Create listing
          </Link>
        </section>
      ) : (
        <section className="space-y-5">
          {paginatedListings.map((listing) => {
            const image =
              listing.coverImage ||
              listing.images?.[0] ||
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop";

            const price = numeral(listing.pricePerNight).format("$0,0");
            const rating =
              listing.rating !== null && listing.rating !== undefined
                ? numeral(listing.rating).format("0.0")
                : "New";

            const createdDate = format(
              new Date(listing.createdAt),
              "MMM d, yyyy"
            );

            return (
              <article
                key={listing.id}
                className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:shadow-xl hover:shadow-neutral-200/70"
              >
                <div className="grid gap-5 p-5 md:grid-cols-[280px_1fr]">
                  <div className="relative h-64 overflow-hidden rounded-3xl bg-neutral-100 md:h-full">
                    <img
                      src={image}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />

                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ${
                        listing.available
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-950 text-white"
                      }`}
                    >
                      {listing.available ? "Available" : "Booked"}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between gap-6">
                    <div>
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h2 className="text-2xl font-black text-neutral-950">
                            {listing.title}
                          </h2>

                          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500">
                            <FaMapMarkerAlt className="text-rose-500" />
                            {listing.location}
                          </p>
                        </div>

                        <p className="flex items-center gap-2 text-sm font-bold text-neutral-900">
                          <FaStar className="text-rose-500" />
                          {rating}
                        </p>
                      </div>

                      <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-neutral-600">
                        {listing.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-neutral-500">
                        <span className="rounded-full bg-neutral-100 px-3 py-1 capitalize">
                          {listing.type.toLowerCase()}
                        </span>

                        <span className="rounded-full bg-neutral-100 px-3 py-1 capitalize">
                          {listing.category.toLowerCase()}
                        </span>

                        <span className="rounded-full bg-neutral-100 px-3 py-1">
                          {listing.guests} {listing.guests === 1 ? "guest" : "guests"}
                        </span>

                        <span className="rounded-full bg-neutral-100 px-3 py-1">
                          Created {createdDate}
                        </span>
                      </div>

                      <p className="mt-5 text-neutral-900">
                        <strong className="text-xl">{price}</strong>{" "}
                        <span className="text-neutral-500">/ night</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/host/listings/${listing.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-800 transition hover:border-rose-500 hover:text-rose-500"
                      >
                        <FaEye />
                        View
                      </Link>

                      <button
                        type="button"
                        disabled={deleteListing.isPending}
                        onClick={() => setDeleteTarget(listing)}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </section>
      )}

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 grid place-items-center p-4">
          <DialogPanel className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-black text-neutral-950">
                Delete listing?
              </DialogTitle>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 transition hover:bg-rose-500 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              This action cannot be undone. This listing will be removed from
              your host account.
            </p>

            {deleteTarget && (
              <div className="mt-5 rounded-3xl bg-neutral-50 p-4">
                <p className="font-black text-neutral-950">
                  {deleteTarget.title}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {deleteTarget.location}
                </p>
              </div>
            )}

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
                disabled={deleteListing.isPending || !deleteTarget}
                onClick={() => {
                  if (!deleteTarget) return;

                  deleteListing.mutate(deleteTarget.id, {
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