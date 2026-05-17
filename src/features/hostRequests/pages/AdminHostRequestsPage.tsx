import { useState } from "react";
import { format } from "date-fns";
import { FaCheck, FaTimes, FaUserShield } from "react-icons/fa";

import { Spinner } from "../../../shared/components/Spinner";
import {
  useAdminHostRequests,
  useApproveHostRequest,
  useRejectHostRequest,
} from "../hooks/useAdminHostRequests";
import type { HostRequestStatus } from "../types";

const filters: Array<HostRequestStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export function AdminHostRequestsPage() {
  const [status, setStatus] = useState<HostRequestStatus | "ALL">("PENDING");
  const [rejectReason, setRejectReason] = useState("");

  const { data: requests = [], isLoading } = useAdminHostRequests(
    status === "ALL" ? undefined : status
  );

  const approveRequest = useApproveHostRequest();
  const rejectRequest = useRejectHostRequest();

  if (isLoading) return <Spinner />;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="mb-8 rounded-4xl bg-neutral-950 p-10 text-white">
        <p className="text-sm font-extrabold uppercase tracking-wide text-rose-400">
          Admin
        </p>

        <h1 className="mt-3 text-4xl font-black">Host Requests</h1>

        <p className="mt-3 max-w-2xl text-neutral-300">
          Review guest applications and approve trusted users to become hosts.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap gap-3">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={`rounded-full px-5 py-3 text-sm font-bold transition ${
              status === item
                ? "bg-rose-500 text-white"
                : "border border-neutral-200 bg-white text-neutral-900 hover:border-rose-500 hover:text-rose-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <section className="rounded-4xl border border-neutral-200 p-10 text-center">
          <FaUserShield className="mx-auto text-5xl text-rose-500" />
          <h2 className="mt-4 text-2xl font-black text-neutral-950">
            No requests found
          </h2>
          <p className="mt-2 text-neutral-500">
            There are no host requests in this category.
          </p>
        </section>
      ) : (
        <section className="space-y-5">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-4xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 font-black text-rose-500">
                      {request.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                      <h2 className="text-xl font-black text-neutral-950">
                        {request.user?.name || "Unknown user"}
                      </h2>
                      <p className="text-sm text-neutral-500">
                        {request.user?.email}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 max-w-3xl leading-7 text-neutral-600">
                    {request.message || "No message provided."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-neutral-500">
                    <span>
                      Status:{" "}
                      <strong className="text-neutral-900">
                        {request.status}
                      </strong>
                    </span>
                    <span>
                      Submitted:{" "}
                      {format(new Date(request.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                {request.status === "PENDING" && (
                  <div className="w-full space-y-3 lg:w-80">
                    <textarea
                      rows={3}
                      value={rejectReason}
                      onChange={(event) => setRejectReason(event.target.value)}
                      placeholder="Optional rejection reason"
                      className="w-full rounded-2xl border border-neutral-200 p-3 text-sm outline-none focus:border-rose-500"
                    />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={approveRequest.isPending}
                        onClick={() => approveRequest.mutate(request.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                      >
                        <FaCheck />
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={rejectRequest.isPending}
                        onClick={() =>
                          rejectRequest.mutate({
                            id: request.id,
                            reason: rejectReason || undefined,
                          })
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
                      >
                        <FaTimes />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}