import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa";

import { useForgotPassword } from "../hooks/useAccount";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/securitySchemas";

export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword.mutate(values);
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-6 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/70">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
            <FaLock />
          </div>

          <h1 className="mt-5 text-3xl font-black text-neutral-950">
            Forgot password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Enter your email and we will send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-neutral-700">
              Email address
            </span>

            <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 focus-within:border-rose-500">
              <FaEnvelope className="text-neutral-400" />
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-sm text-rose-500">
                {errors.email.message}
              </p>
            )}
          </label>

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="w-full rounded-2xl bg-rose-500 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
          >
            {forgotPassword.isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Remember your password?{" "}
          <Link to="/login" className="font-bold text-rose-500 hover:underline">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}