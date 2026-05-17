import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaLock, FaShieldAlt } from "react-icons/fa";

import { useChangePassword } from "../hooks/useAccount";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/securitySchemas";

export function SecurityPage() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(values, {
      onSuccess: () => reset(),
    });
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="mb-8 rounded-[2rem] bg-neutral-950 p-10 text-white">
        <p className="text-sm font-extrabold uppercase tracking-wide text-rose-400">
          Security
        </p>

        <h1 className="mt-3 text-4xl font-black">Change password</h1>

        <p className="mt-3 max-w-2xl text-neutral-300">
          Keep your account secure by using a strong password.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
            <FaShieldAlt />
          </div>

          <h2 className="mt-5 text-2xl font-black text-neutral-950">
            Account protection
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Use at least 8 characters. Avoid using your old password or easy
            personal information.
          </p>
        </aside>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
              <FaLock />
            </div>

            <div>
              <h2 className="text-2xl font-black text-neutral-950">
                Password details
              </h2>
              <p className="text-sm text-neutral-500">
                Enter your current password and choose a new one.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Field label="Current password" error={errors.currentPassword?.message}>
              <input
                type="password"
                {...register("currentPassword")}
                className="input"
              />
            </Field>

            <Field label="New password" error={errors.newPassword?.message}>
              <input
                type="password"
                {...register("newPassword")}
                className="input"
              />
            </Field>

            <Field
              label="Confirm new password"
              error={errors.confirmNewPassword?.message}
            >
              <input
                type="password"
                {...register("confirmNewPassword")}
                className="input"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={changePassword.isPending}
            className="mt-8 rounded-2xl bg-rose-500 px-8 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
          >
            {changePassword.isPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-neutral-700">
        {label}
      </span>
      {children}
      {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
    </label>
  );
}