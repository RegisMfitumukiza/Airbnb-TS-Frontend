import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaCheckCircle, FaHome, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import { z } from "zod";

import { Spinner } from "../../../shared/components/Spinner";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCreateHostRequest, useMyHostRequests } from "../hooks/useHostRequests";

const hostRequestSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
});

type HostRequestFormValues = z.infer<typeof hostRequestSchema>;

export function BecomeHostPage() {
  const { user } = useAuth();
  const { data: requests = [], isLoading } = useMyHostRequests();
  const createRequest = useCreateHostRequest();

  const latestRequest = requests[0];
  const hasPendingRequest = latestRequest?.status === "PENDING";
  const isApproved = user?.role === "HOST" || latestRequest?.status === "APPROVED";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HostRequestFormValues>({
    resolver: zodResolver(hostRequestSchema),
  });

  const onSubmit = (values: HostRequestFormValues) => {
    createRequest.mutate(values);
  };

  if (isLoading) return <Spinner />;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl bg-neutral-950 p-10 text-white"
        >
          <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-rose-400">
            Become a host
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Share your space and start hosting.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
            Submit a request to become a host. An admin will review your account
            before you can create listings.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Apply", "Admin review", "Create listings"].map((item) => (
              <div key={item} className="rounded-3xl bg-white/10 p-5">
                <FaHome className="mb-3 text-rose-400" />
                <p className="font-bold">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <aside className="rounded-4xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60">
          {isApproved ? (
            <div className="text-center">
              <FaCheckCircle className="mx-auto text-5xl text-green-600" />
              <h2 className="mt-4 text-2xl font-black text-neutral-950">
                You are approved
              </h2>
              <p className="mt-2 text-neutral-500">
                You can now access your host dashboard and create listings.
              </p>
            </div>
          ) : hasPendingRequest ? (
            <div className="text-center">
              <FaHourglassHalf className="mx-auto text-5xl text-rose-500" />
              <h2 className="mt-4 text-2xl font-black text-neutral-950">
                Request pending
              </h2>
              <p className="mt-2 text-neutral-500">
                Your request is waiting for admin approval.
              </p>
            </div>
          ) : latestRequest?.status === "REJECTED" ? (
            <div>
              <div className="mb-6 text-center">
                <FaTimesCircle className="mx-auto text-5xl text-rose-500" />
                <h2 className="mt-4 text-2xl font-black text-neutral-950">
                  Request rejected
                </h2>
                <p className="mt-2 text-neutral-500">
                  You may submit a new request with better details.
                </p>
              </div>

              <HostRequestForm
                register={register}
                errors={errors}
                onSubmit={handleSubmit(onSubmit)}
                isSubmitting={createRequest.isPending}
              />
            </div>
          ) : (
            <HostRequestForm
              register={register}
              errors={errors}
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={createRequest.isPending}
            />
          )}
        </aside>
      </section>
    </main>
  );
}

type HostRequestFormProps = {
  register: ReturnType<typeof useForm<HostRequestFormValues>>["register"];
  errors: ReturnType<typeof useForm<HostRequestFormValues>>["formState"]["errors"];
  onSubmit: () => void;
  isSubmitting: boolean;
};

function HostRequestForm({
  register,
  errors,
  onSubmit,
  isSubmitting,
}: HostRequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-neutral-950">
          Request host access
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Tell admins why you want to become a host.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-neutral-700">Message</span>
        <textarea
          rows={6}
          placeholder="Example: I want to list my apartment in Kigali and manage guest stays professionally."
          className="mt-2 w-full rounded-3xl border border-neutral-200 p-4 text-sm outline-none transition focus:border-rose-500"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-rose-500">{errors.message.message}</p>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-rose-500 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}