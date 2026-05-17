import clsx from "clsx";
import { format } from "date-fns";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaRegHeart, FaStar } from "react-icons/fa";

import type { Listing } from "../types";

type ListingCardProps = {
  listing: Listing;
  saved: boolean;
  onToggleSave: () => void;
};

function getRatingLabel(listing: Listing) {
  if (
    listing.rating !== null &&
    listing.rating !== undefined
  ) {
    return numeral(listing.rating).format("0.0");
  }

  return "—";
}

export function ListingCard({
  listing,
  saved,
  onToggleSave,
}: ListingCardProps) {
  const isLuxury = listing.pricePerNight > 300;

  const formattedPrice = numeral(
    listing.pricePerNight
  ).format("$0,0");

  const ratingLabel = getRatingLabel(listing);

  const guestLabel = `${listing.guests} ${
    listing.guests === 1
      ? "guest"
      : "guests"
  }`;

  const availableDate = listing.available
    ? listing.availableFrom &&
      new Date(listing.availableFrom) >
        new Date()
      ? `Available from ${format(
          new Date(listing.availableFrom),
          "MMM d, yyyy"
        )}`
      : "Available now"
    : "Currently unavailable";

  const image =
    listing.coverImage ||
    listing.images?.[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop";

  return (
    <article
      className={clsx(
        "group relative overflow-hidden rounded-3xl bg-white transition duration-200 hover:-translate-y-1",
        !listing.available && "opacity-75"
      )}
    >
      <Link
        to={`/listings/${listing.id}`}
        className="block"
      >
        <div className="relative h-64 overflow-hidden rounded-3xl bg-neutral-100">
          <img
            src={image}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {listing.superhost && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-900 shadow-sm">
                Superhost
              </span>
            )}

            {isLuxury && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-900 shadow-sm">
                Luxury
              </span>
            )}

            {!listing.available && (
              <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={onToggleSave}
        aria-label={
          saved
            ? "Remove from saved"
            : "Save listing"
        }
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-lg text-rose-500 shadow-sm transition hover:scale-105 hover:bg-white"
      >
        {saved ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )}
      </button>

      <div className="px-1 py-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/listings/${listing.id}`}
          >
            <h2 className="line-clamp-1 text-base font-bold text-neutral-950 transition group-hover:text-rose-500">
              {listing.title}
            </h2>
          </Link>

          <p className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-neutral-900">
            <FaStar className="text-rose-500" />
            {ratingLabel}
          </p>
        </div>

        <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
          <FaMapMarkerAlt className="text-rose-500" />
          <span>
            {listing.location}
          </span>
        </p>

        <p className="mt-2 text-sm capitalize text-neutral-500">
          {guestLabel} ·{" "}
          {listing.type.toLowerCase()} ·{" "}
          {listing.category.toLowerCase()}
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          {availableDate}
        </p>

        <p className="mt-3 text-sm text-neutral-900">
          <strong className="text-base">
            {formattedPrice}
          </strong>{" "}
          / night
        </p>
      </div>
    </article>
  );
}