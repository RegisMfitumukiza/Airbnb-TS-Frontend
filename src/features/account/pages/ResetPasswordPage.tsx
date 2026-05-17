import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaKey, FaLock } from "react-icons/fa";

import { useResetPassword } from "../hooks/useAccount";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/securitySchemas";

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const resetPassword = useResetPassword(token || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return;

    resetPassword.mutate(values, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-6 py-10">
        <p className="rounded-3xl bg-rose-50 p-8 text-center text-rose-600">
          Reset token is missing.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-6 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/70">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
            <FaKey />
          </div>

          <h1 className="mt-5 text-3xl font-black text-neutral-950">
            Reset password
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Choose a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <PasswordField
            label="New password"
            error={errors.newPassword?.message}
          >
            <input
              type="password"
              {...register("newPassword")}
              className="w-full bg-transparent text-sm outline-none"
            />
          </PasswordField>

          <PasswordField
            label="Confirm new password"
            error={errors.confirmNewPassword?.message}
          >
            <input
              type="password"
              {...register("confirmNewPassword")}
              className="w-full bg-transparent text-sm outline-none"
            />
          </PasswordField>

          <button
            type="submit"
            disabled={resetPassword.isPending}
            className="w-full rounded-2xl bg-rose-500 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
          >
            {resetPassword.isPending ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Back to{" "}
          <Link to="/login" className="font-bold text-rose-500 hover:underline">
            login
          </Link>
        </p>
      </section>
    </main>
  );
}

type PasswordFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function PasswordField({ label, error, children }: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-neutral-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 focus-within:border-rose-500">
        <FaLock className="text-neutral-400" />
        {children}
      </div>

      {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
    </label>
  );
}