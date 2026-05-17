import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import numeral from "numeral";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  FaArrowLeft,
  FaBed,
  FaCalendarAlt,
  FaEdit,
  FaHome,
  FaImage,
  FaMapMarkerAlt,
  FaStar,
  FaTimes,
  FaTrash,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import toast from "react-hot-toast";

import api from "../../../lib/api";
import { Spinner } from "../../../shared/components/Spinner";
import type { Listing } from "../../listings/types";
import { deleteAdminListing } from "../api/adminManagementApi";

type ListingResponse = {
  success: boolean;
  message: string;
  data: Listing & {
    host?: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
    };
    bookings?: unknown[];
    reviews?: unknown[];
    _count?: {
      bookings?: number;
      reviews?: number;
    };
  };
};

async function getAdminListingById(id: string) {
  const response = await api.get<ListingResponse>(`/listings/${id}`);
  return response.data.data;
}

export function AdminListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "listings", id],
    queryFn: () => getAdminListingById(id as string),
    enabled: Boolean(id),
  });

  const deleteListing = useMutation({
    mutationFn: deleteAdminListing,
    onSuccess: () => {
      toast.success("Listing deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      navigate("/admin/listings");
    },
    onError: () => toast.error("Failed to delete listing"),
  });

  if (isLoading) return <Spinner />;

  if (isError || !listing) {
    return (
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-10 text-center">
        <FaHome className="mx-auto text-4xl text-rose-500" />
        <h1 className="mt-4 text-2xl font-black text-neutral-950">
          Listing not found
        </h1>
        <button
          type="button"
          onClick={() => navigate("/admin/listings")}
          className="mt-6 rounded-full bg-neutral-950 px-6 py-3 font-bold text-white"
        >
          Back to listings
        </button>
      </div>
    );
  }

  const coverImage =
    listing.coverImage ||
    listing.images?.[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop";

  const bookingCount =
    listing._count?.bookings ?? listing.bookings?.length ?? 0;

  const reviewCount = listing._count?.reviews ?? listing.reviews?.length ?? 0;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/listings")}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-600 transition hover:border-rose-500 hover:text-rose-500"
          >
            <FaArrowLeft />
            Back to admin listings
          </button>

          <h1 className="text-3xl font-black text-neutral-950">
            {listing.title}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500">
            <FaMapMarkerAlt className="text-rose-500" />
            {listing.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/admin/listings/${listing.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500"
          >
            <FaEdit />
            Edit listing
          </Link>

          <Link
            to={`/admin/listings/${listing.id}/images`}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500"
          >
            <FaImage />
            Manage images
          </Link>

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
            <img
              src={coverImage}
              alt={listing.title}
              className="h-[420px] w-full object-cover"
            />

            {listing.images && listing.images.length > 0 && (
              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                {listing.images.slice(0, 4).map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={listing.title}
                    className="h-32 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-neutral-950">
              Description
            </h2>
            <p className="mt-3 leading-7 text-neutral-600">
              {listing.description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-neutral-950">Amenities</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {listing.amenities?.length ? (
                listing.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-bold text-neutral-700"
                  >
                    {amenity}
                  </span>
                ))
              ) : (
                <p className="text-sm text-neutral-500">No amenities listed.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-neutral-500">Status</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  listing.available
                    ? "bg-green-50 text-green-700"
                    : "bg-neutral-950 text-white"
                }`}
              >
                {listing.available ? "Available" : "Unavailable"}
              </span>
            </div>

            <p className="mt-5 text-3xl font-black text-neutral-950">
              {numeral(listing.pricePerNight).format("$0,0")}
              <span className="text-sm font-semibold text-neutral-500">
                {" "}
                / night
              </span>
            </p>

            <div className="mt-6 grid gap-3">
              <InfoRow icon={<FaHome />} label="Type" value={listing.type} />
              <InfoRow
                icon={<FaBed />}
                label="Category"
                value={listing.category}
              />
              <InfoRow
                icon={<FaUsers />}
                label="Guests"
                value={`${listing.guests}`}
              />
              <InfoRow
                icon={<FaStar />}
                label="Rating"
                value={listing.rating ? `${listing.rating}/5` : "Not rated"}
              />
              <InfoRow
                icon={<FaCalendarAlt />}
                label="Available from"
                value={
                  listing.availableFrom
                    ? new Date(listing.availableFrom).toLocaleDateString()
                    : "Not specified"
                }
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-neutral-950">Host</h2>

            {listing.host ? (
              <div className="mt-4 flex items-center gap-4 rounded-3xl bg-neutral-50 p-4">
                <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-rose-50 font-black text-rose-500">
                  {listing.host.avatar ? (
                    <img
                      src={listing.host.avatar}
                      alt={listing.host.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>

                <div>
                  <p className="font-black text-neutral-950">
                    {listing.host.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {listing.host.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-neutral-500">
                Host information not available.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <StatCard label="Bookings" value={bookingCount} />
            <StatCard label="Reviews" value={reviewCount} />
          </div>
        </aside>
      </section>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
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
                onClick={() => setDeleteOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 transition hover:bg-rose-500 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              This action cannot be undone. This listing will be removed from
              the platform.
            </p>

            <div className="mt-5 rounded-3xl bg-neutral-50 p-4">
              <p className="font-black text-neutral-950">{listing.title}</p>
              <p className="mt-1 text-sm text-neutral-500">
                {listing.location}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="flex-1 rounded-2xl border border-neutral-200 px-5 py-3 font-bold transition hover:border-rose-500 hover:text-rose-500"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteListing.isPending}
                onClick={() => deleteListing.mutate(listing.id)}
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

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-100 p-4">
      <div className="flex items-center gap-3 text-sm font-bold text-neutral-500">
        <span className="text-rose-500">{icon}</span>
        {label}
      </div>
      <span className="text-sm font-black text-neutral-950">{value}</span>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-neutral-950">{value}</p>
    </div>
  );
}