import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import numeral from "numeral";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaHome,
  FaMapMarkerAlt,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { DashboardTopbar } from "../../../shared/components/DashboardTopbar";
import { Pagination } from "../../../shared/components/Pagination";
import { Spinner } from "../../../shared/components/Spinner";
import type { Listing } from "../../listings/types";
import {
  deleteAdminListing,
  getAdminListings,
} from "../api/adminManagementApi";

export function AdminListingsPage() {
  const queryClient = useQueryClient();

  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 4;

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin", "listings"],
    queryFn: getAdminListings,
  });

  const deleteListing = useMutation({
    mutationFn: deleteAdminListing,
    onSuccess: () => {
      toast.success("Listing deleted");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: () => toast.error("Failed to delete listing"),
  });

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
        title="Listings"
        subtitle="Inspect and moderate platform listings."
        searchValue={search}
        searchPlaceholder="Search listings..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <section className="grid gap-5">
        {paginatedListings.map((listing) => {
          const image =
            listing.coverImage ||
            listing.images?.[0] ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop";

          return (
            <article
              key={listing.id}
              className="grid gap-5 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-neutral-200/70 md:grid-cols-[240px_1fr]"
            >
              <img
                src={image}
                alt={listing.title}
                className="h-52 w-full rounded-3xl object-cover"
              />

              <div className="flex flex-col justify-between gap-4">
                <div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-black text-neutral-950">
                        {listing.title}
                      </h2>

                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500">
                        <FaMapMarkerAlt className="text-rose-500" />
                        {listing.location}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                        listing.available
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-950 text-white"
                      }`}
                    >
                      {listing.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
                    {listing.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-500">
                      {listing.type}
                    </span>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600">
                      {listing.category}
                    </span>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600">
                      {listing.guests} guests
                    </span>
                  </div>

                  <p className="mt-4 font-black text-neutral-950">
                    {numeral(listing.pricePerNight).format("$0,0")}{" "}
                    <span className="font-semibold text-neutral-500">
                      / night
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/admin/listings/${listing.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500"
                  >
                    <FaEye />
                    View
                  </Link>

                  <button
                    type="button"
                    disabled={deleteListing.isPending}
                    onClick={() => setDeleteTarget(listing)}
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {filteredListings.length === 0 && (
          <div className="rounded-[2rem] border border-neutral-200 p-12 text-center">
            <FaHome className="mx-auto text-4xl text-rose-500" />
            <h2 className="mt-4 text-2xl font-black">No listings found</h2>
          </div>
        )}
      </section>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

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
              the platform.
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
                  deleteListing.mutate(deleteTarget.id);
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