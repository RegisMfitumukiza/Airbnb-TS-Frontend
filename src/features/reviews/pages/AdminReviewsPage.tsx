import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import {
  FaCommentDots,
  FaEye,
  FaStar,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import { DashboardTopbar } from "../../../shared/components/DashboardTopbar";
import { Pagination } from "../../../shared/components/Pagination";
import { Spinner } from "../../../shared/components/Spinner";
import { useAllReviews, useDeleteReview } from "../hooks/useReviews";
import type { Review } from "../types";

export function AdminReviewsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const limit = 6;

  const { data: reviews = [], isLoading } = useAllReviews();
  const deleteReview = useDeleteReview();

  const filteredReviews = useMemo(() => {
    const normalized = search.toLowerCase().trim();

    return reviews.filter((review) => {
      return (
        review.comment.toLowerCase().includes(normalized) ||
        review.rating.toString().includes(normalized) ||
        review.user?.name?.toLowerCase().includes(normalized) ||
        review.user?.email?.toLowerCase().includes(normalized) ||
        review.listing?.title?.toLowerCase().includes(normalized) ||
        review.listing?.location?.toLowerCase().includes(normalized)
      );
    });
  }, [reviews, search]);

  const totalPages = Math.ceil(filteredReviews.length / limit) || 1;
  const paginatedReviews = filteredReviews.slice(
    (page - 1) * limit,
    page * limit
  );

  if (isLoading) return <Spinner />;

  return (
    <>
      <DashboardTopbar
        title="Reviews"
        subtitle="Moderate guest reviews and remove inappropriate content."
        searchValue={search}
        searchPlaceholder="Search reviews..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-500">
            <FaCommentDots />
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-950">
              Platform reviews
            </h2>
            <p className="text-sm text-neutral-500">
              {filteredReviews.length} reviews found
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {paginatedReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:shadow-neutral-200/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-rose-500" />
                    <span className="font-black text-neutral-950">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-neutral-500">
                    {review.listing?.title || "Listing"}
                  </p>
                </div>

                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600">
                  {review.createdAt
                    ? format(new Date(review.createdAt), "MMM d, yyyy")
                    : "N/A"}
                </span>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600">
                {review.comment}
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-3xl bg-neutral-50 p-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-rose-50 text-rose-500">
                  {review.user?.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-neutral-950">
                    {review.user?.name || "Guest"}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {review.user?.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedReview(review)}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-800 transition hover:border-rose-500 hover:text-rose-500"
                >
                  <FaEye />
                  View
                </button>

                <button
                  type="button"
                  disabled={deleteReview.isPending}
                  onClick={() => setDeleteTarget(review)}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="rounded-3xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
            No reviews found.
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>

      <Dialog
        open={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 grid place-items-center p-4">
          <DialogPanel className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <DialogTitle className="text-2xl font-black text-neutral-950">
                Review details
              </DialogTitle>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 transition hover:bg-rose-500 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            {selectedReview && (
              <div className="space-y-4">
                <DetailBox
                  label="Rating"
                  value={`${selectedReview.rating}/5`}
                />

                <DetailBox
                  label="Guest"
                  value={`${selectedReview.user?.name || "Guest"} • ${
                    selectedReview.user?.email || "No email"
                  }`}
                />

                <DetailBox
                  label="Listing"
                  value={`${selectedReview.listing?.title || "Listing"} • ${
                    selectedReview.listing?.location || "No location"
                  }`}
                />

                <div className="rounded-2xl border border-neutral-200 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
                    Comment
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    {selectedReview.comment}
                  </p>
                </div>
              </div>
            )}
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
              Delete review?
            </DialogTitle>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              This action cannot be undone. Use this only for inappropriate,
              abusive, or fake reviews.
            </p>

            {deleteTarget && (
              <div className="mt-5 rounded-3xl bg-neutral-50 p-4">
                <p className="line-clamp-3 text-sm text-neutral-700">
                  {deleteTarget.comment}
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
                disabled={deleteReview.isPending || !deleteTarget}
                onClick={() => {
                  if (!deleteTarget) return;

                  deleteReview.mutate(deleteTarget.id, {
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

type DetailBoxProps = {
  label: string;
  value: string;
};

function DetailBox({ label, value }: DetailBoxProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-neutral-800">{value}</p>
    </div>
  );
}