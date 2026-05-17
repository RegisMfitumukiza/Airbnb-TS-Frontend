import { useState } from "react";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isBefore,
  startOfToday,
} from "date-fns";
import numeral from "numeral";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCamera,
  FaHeart,
  FaHome,
  FaMapMarkerAlt,
  FaRegHeart,
  FaShare,
  FaStar,
  FaUsers,
} from "react-icons/fa";

import { Spinner } from "../../../shared/components/Spinner";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCreateBooking } from "../../bookings/hooks/useBookings";
import {
  useCreateReview,
  useListingReviews,
} from "../../reviews/hooks/useReviews";
import { useListing } from "../hooks/useListings";
import { useSavedListings } from "../hooks/useSavedListings";
import type { Listing } from "../types";

function getRatingLabel(listing: Listing) {
  if (listing.rating !== null && listing.rating !== undefined) {
    return numeral(listing.rating).format("0.0");
  }

  return "No reviews";
}

type ListingReview = {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  listingId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

type ListingBooking = {
  id: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
};

export function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuth();
  const { data: listing, isLoading, isError } = useListing(id);
  const { data: reviews = [] } = useListingReviews(id);
  const createReview = useCreateReview();
  const createBooking = useCreateBooking();
  const { isSaved, toggleSave } = useSavedListings();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isLoading) return <Spinner />;

  if (isError || !listing) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] border border-neutral-200 p-12 text-center">
          <h1 className="text-3xl font-black text-neutral-950">
            Listing not found
          </h1>

          <Link
            to="/listings"
            className="mt-6 inline-flex rounded-full bg-neutral-950 px-6 py-3 font-bold text-white transition hover:bg-rose-500"
          >
            Back to listings
          </Link>
        </div>
      </main>
    );
  }

  const listingWithRelations = listing as Listing & {
    reviews?: ListingReview[];
    bookings?: ListingBooking[];
  };

  const listingReviews =
    listingWithRelations.reviews && listingWithRelations.reviews.length > 0
      ? listingWithRelations.reviews
      : reviews;

  const averageReviewRating =
    listingReviews.length > 0
      ? listingReviews.reduce((sum, review) => sum + review.rating, 0) /
        listingReviews.length
      : null;

  const ratingLabel =
    listing.rating !== null && listing.rating !== undefined
      ? numeral(listing.rating).format("0.0")
      : averageReviewRating !== null
        ? numeral(averageReviewRating).format("0.0")
        : getRatingLabel(listing);

  const images = [listing.coverImage, ...(listing.images || [])].filter(
    Boolean
  ) as string[];

  const coverImage =
    images[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop";

  const price = numeral(listing.pricePerNight).format("$0,0");

  const availableFrom = listing.availableFrom
    ? format(new Date(listing.availableFrom), "MMM d, yyyy")
    : null;

  const activeBookings = (listingWithRelations.bookings || []).filter(
    (booking) => booking.status !== "CANCELLED"
  );

  const hasUpcomingBookings = activeBookings.some(
    (booking) => new Date(booking.checkOut) >= new Date()
  );

  const availableFromDate = listing.availableFrom
    ? new Date(listing.availableFrom)
    : null;

  const isAvailableFromFuture = availableFromDate
    ? availableFromDate > new Date()
    : false;

  const availabilityText = !listing.available
    ? "This stay is currently unavailable"
    : isAvailableFromFuture && availableFrom
      ? `Available from ${availableFrom}`
      : hasUpcomingBookings
        ? "Available now · Some dates are already booked"
        : "Available now";

  const visibleAmenities = showAllAmenities
    ? listing.amenities
    : listing.amenities.slice(0, 6);

  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const nights =
    checkIn && checkOut
      ? Math.max(
          differenceInCalendarDays(new Date(checkOut), new Date(checkIn)),
          0
        )
      : 0;

  const serviceFee = nights > 0 ? 20 : 0;
  const totalPrice = nights * listing.pricePerNight + serviceFee;

  const canGuestBook =
    isAuthenticated && user?.role === "GUEST" && listing.available;

  const handleReserve = () => {
    if (!isAuthenticated) {
      toast.error("Please login to reserve this stay");
      navigate("/login");
      return;
    }

    if (user?.role !== "GUEST") {
      toast.error("Only guest accounts can reserve stays");
      return;
    }

    if (!listing.available) {
      toast.error("This listing is not available");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Select check-in and check-out dates");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const tomorrowDate = startOfToday();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    if (isBefore(checkInDate, tomorrowDate)) {
      toast.error("Check-in must be a future date");
      return;
    }

    if (differenceInCalendarDays(checkOutDate, checkInDate) <= 0) {
      toast.error("Check-out must be after check-in");
      return;
    }

    createBooking.mutate(
      {
        listingId: listing.id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
      },
      {
        onSuccess: () => {
          navigate("/my-bookings");
        },
      }
    );
  };

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      toast.error("Write a review comment first");
      return;
    }

    createReview.mutate(
      {
        listingId: listing.id,
        rating: reviewRating,
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          setComment("");
          setReviewRating(5);
        },
      }
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <Link
        to="/listings"
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-700 transition hover:text-rose-500"
      >
        <FaArrowLeft />
        Back to listings
      </Link>

      <section className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-neutral-950">
            {listing.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-neutral-600">
            <span className="flex items-center gap-1">
              <FaStar className="text-rose-500" />
              {ratingLabel}
            </span>

            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-rose-500" />
              {listing.location}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500"
          >
            <FaShare />
            Share
          </button>

          <button
            type="button"
            onClick={() => toggleSave(listing.id)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500"
          >
            {isSaved(listing.id) ? <FaHeart /> : <FaRegHeart />}
            Save
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-3 overflow-hidden rounded-[2rem] md:grid-cols-[1.4fr_1fr]">
        <img
          src={coverImage}
          alt={listing.title}
          className="h-[420px] w-full object-cover"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {(images.length > 1 ? images.slice(1, 5) : [coverImage]).map(
            (image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={listing.title}
                className="h-[205px] w-full object-cover"
              />
            )
          )}
        </div>
      </section>

      {images.length > 1 && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold shadow-xl shadow-neutral-200 transition hover:text-rose-500"
          >
            <FaCamera />
            Show all photos
          </button>
        </div>
      )}

      <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <section className="border-b border-neutral-200 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black text-neutral-950">
                Hosted by {listing.host?.name || "Host"}
              </h2>

              {listing.superhost && (
                <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-600">
                  Superhost
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-neutral-600">
              <span className="flex items-center gap-2">
                <FaUsers className="text-rose-500" />
                Up to {listing.guests}{" "}
                {listing.guests === 1 ? "guest" : "guests"}
              </span>

              <span className="flex items-center gap-2">
                <FaHome className="text-rose-500" />
                {listing.type.toLowerCase()}
              </span>

              <span className="rounded-full bg-neutral-100 px-3 py-1 capitalize">
                {listing.category.toLowerCase()}
              </span>
            </div>
          </section>

          <section className="border-b border-neutral-200 py-8">
            <h2 className="text-2xl font-black text-neutral-950">
              About this place
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              {listing.description}
            </p>
          </section>

          <section className="border-b border-neutral-200 py-8">
            <h2 className="text-2xl font-black text-neutral-950">
              What this place offers
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {visibleAmenities.map((amenity) => (
                <div
                  key={amenity}
                  className="rounded-2xl border border-neutral-200 px-5 py-4 text-sm font-bold capitalize text-neutral-800"
                >
                  {amenity}
                </div>
              ))}
            </div>

            {listing.amenities.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllAmenities((current) => !current)}
                className="mt-5 rounded-full border border-neutral-300 px-5 py-3 text-sm font-black transition hover:border-rose-500 hover:text-rose-500"
              >
                {showAllAmenities
                  ? "Show fewer amenities"
                  : `Show all ${listing.amenities.length} amenities`}
              </button>
            )}
          </section>

          <section className="py-8">
            <h2 className="text-2xl font-black text-neutral-950">
              Availability
            </h2>

            <p className="mt-4 text-neutral-600">{availabilityText}</p>
          </section>
        </div>

        <aside className="h-fit rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-2xl shadow-neutral-200/60 lg:sticky lg:top-28">
          <div className="flex items-start justify-between gap-4">
            <p className="text-neutral-900">
              <strong className="text-3xl">{price}</strong>{" "}
              <span className="text-neutral-500">/ night</span>
            </p>

            <p className="flex items-center gap-1 text-sm font-bold text-neutral-900">
              <FaStar className="text-rose-500" />
              {ratingLabel}
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-neutral-200">
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-neutral-200 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
                  Check-in
                </p>

                <input
                  type="date"
                  value={checkIn}
                  min={tomorrow}
                  onChange={(event) => {
                    setCheckIn(event.target.value);

                    if (
                      checkOut &&
                      differenceInCalendarDays(
                        new Date(checkOut),
                        new Date(event.target.value)
                      ) <= 0
                    ) {
                      setCheckOut("");
                    }
                  }}
                  className="mt-2 w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none"
                />
              </div>

              <div className="border-b border-neutral-200 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
                  Check-out
                </p>

                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || tomorrow}
                  onChange={(event) => setCheckOut(event.target.value)}
                  className="mt-2 w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="p-4">
              <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
                Guests
              </p>

              <p className="mt-2 text-sm font-semibold text-neutral-900">
                Up to {listing.guests}{" "}
                {listing.guests === 1 ? "guest" : "guests"}
              </p>
            </div>
          </div>

          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-2xl bg-neutral-950 py-4 text-sm font-black text-white transition hover:bg-rose-500"
            >
              Login to reserve
            </button>
          ) : !canGuestBook ? (
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-2xl bg-neutral-200 py-4 text-sm font-black text-neutral-500"
            >
              {listing.available ? "Only guests can reserve" : "Unavailable"}
            </button>
          ) : (
            <button
              type="button"
              disabled={createBooking.isPending}
              onClick={handleReserve}
              className="mt-6 w-full rounded-2xl bg-rose-500 py-4 text-sm font-black text-white transition hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:opacity-50"
            >
              {createBooking.isPending ? "Reserving..." : "Reserve"}
            </button>
          )}

          <p className="mt-4 text-center text-sm text-neutral-500">
            You won&apos;t be charged yet
          </p>

          {nights > 0 && (
            <div className="mt-6 space-y-3 border-t border-neutral-200 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">
                  {price} × {nights} {nights === 1 ? "night" : "nights"}
                </span>

                <span className="font-bold text-neutral-900">
                  {numeral(nights * listing.pricePerNight).format("$0,0")}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Service fee</span>
                <span className="font-bold text-neutral-900">
                  {numeral(serviceFee).format("$0,0")}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-base font-black text-neutral-950">
                <span>Total</span>
                <span>{numeral(totalPrice).format("$0,0")}</span>
              </div>
            </div>
          )}
        </aside>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-10">
        <h2 className="text-3xl font-black text-neutral-950">Reviews</h2>

        {listingReviews.length === 0 ? (
          <p className="mt-4 text-neutral-500">No reviews yet.</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {listingReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-black text-neutral-950">
                      {review.user?.name || "Guest"}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 font-black">
                    <FaStar className="text-rose-500" />
                    {review.rating}
                  </div>
                </div>

                <p className="mt-4 leading-7 text-neutral-600">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {isAuthenticated && user?.role === "GUEST" && (
          <div className="mt-10 max-w-xl rounded-3xl border border-neutral-200 p-6">
            <h3 className="text-xl font-black text-neutral-950">
              Leave a review
            </h3>

            <select
              value={reviewRating}
              onChange={(event) => setReviewRating(Number(event.target.value))}
              className="mt-4 rounded-xl border border-neutral-200 p-3 font-bold outline-none focus:border-rose-500"
            >
              {[1, 2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>
                  {number} star{number > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share your experience..."
              className="mt-4 w-full rounded-2xl border border-neutral-200 p-4 outline-none focus:border-rose-500"
              rows={4}
            />

            <button
              type="button"
              disabled={createReview.isPending}
              onClick={handleSubmitReview}
              className="mt-4 rounded-full bg-rose-500 px-6 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-50"
            >
              {createReview.isPending ? "Submitting..." : "Submit review"}
            </button>
          </div>
        )}
      </section>

      {galleryOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-white p-6">
          <div className="mx-auto max-w-6xl">
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="mb-6 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500"
            >
              Close photos
            </button>

            <div className="grid gap-5 md:grid-cols-2">
              {images.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={listing.title}
                  className="w-full rounded-3xl object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}