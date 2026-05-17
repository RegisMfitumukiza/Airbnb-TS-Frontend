import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import {
    FaCamera,
    FaHome,
    FaTrash,
    FaUserCircle,
    FaUserShield,
} from "react-icons/fa";

import { Spinner } from "../../../shared/components/Spinner";
import { useAuth } from "../../auth/hooks/useAuth";
import {
    useDeleteAvatar,
    useUpdateAccount,
    useUploadAvatar,
} from "../hooks/useAccount";
import {
    accountSchema,
    type AccountFormValues,
} from "../schemas/accountSchemas";

export function AccountPage() {
    const { user, isLoadingUser } = useAuth();

    const updateAccount = useUpdateAccount();
    const uploadAvatar = useUploadAvatar();
    const deleteAvatar = useDeleteAvatar();

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const location = useLocation();

    const securityPath = location.pathname.startsWith("/admin")
        ? "/admin/account/security"
        : location.pathname.startsWith("/host")
            ? "/host/account/security"
            : "/account/security";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
    });

    useEffect(() => {
        if (!user) return;

        reset({
            name: user.name,
            email: user.email,
            username: user.username,
            phone: user.phone,
            bio: user.bio || "",
        });
    }, [user, reset]);

    if (isLoadingUser) return <Spinner />;

    if (!user) {
        return (
            <main className="mx-auto max-w-5xl px-6 py-10">
                <p className="rounded-3xl bg-rose-50 p-8 text-center font-semibold text-rose-600">
                    Please login to view your account.
                </p>
            </main>
        );
    }

    const onSubmit = (values: AccountFormValues) => {
        updateAccount.mutate(values);
    };

    const roleLabel =
        user.role === "ADMIN"
            ? "Platform Admin"
            : user.role === "HOST"
                ? "Approved Host"
                : "Guest Account";

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <section className="mb-8 rounded-[2rem] bg-neutral-950 p-10 text-white">
                <p className="text-sm font-extrabold uppercase tracking-wide text-rose-400">
                    Account
                </p>

                <h1 className="mt-3 text-4xl font-black">Your profile</h1>

                <p className="mt-3 max-w-2xl text-neutral-300">
                    Manage your personal information, profile photo, and account identity.
                </p>
            </section>

            <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
                <aside className="h-fit rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60">
                    <div className="text-center">
                        <div className="mx-auto grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-rose-50 text-6xl text-rose-500">
                            {avatarPreview || user.avatar ? (
                                <img
                                    src={avatarPreview || user.avatar || ""}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <FaUserCircle />
                            )}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                            <h2 className="text-2xl font-black text-neutral-950">
                                {user.name}
                            </h2>

                            {user.role === "HOST" && user.superhost && (
                                <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-600">
                                    Superhost
                                </span>
                            )}
                        </div>

                        <p className="mt-2 text-sm text-neutral-500">
                            {user.email}
                        </p>

                        <div className="mt-4 flex justify-center">
                            <span className="inline-flex rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-500">
                                {roleLabel}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600">
                            <FaCamera />
                            Upload avatar

                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(event) => {
                                    const file = event.target.files?.[0];

                                    if (!file) return;

                                    setAvatarPreview(URL.createObjectURL(file));
                                    uploadAvatar.mutate(file);
                                }}
                            />
                        </label>

                        {user.avatar && (
                            <button
                                type="button"
                                disabled={deleteAvatar.isPending}
                                onClick={() => {
                                    if (!confirm("Delete your avatar?")) return;

                                    setAvatarPreview(null);
                                    deleteAvatar.mutate();
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 font-bold text-white transition hover:bg-rose-500 disabled:opacity-60"
                            >
                                <FaTrash />
                                Delete avatar
                            </button>
                        )}

                        <Link
                            to={securityPath}
                            className="flex w-full items-center justify-center rounded-2xl border border-neutral-200 px-5 py-3 font-bold text-neutral-900 transition hover:border-rose-500 hover:text-rose-500"
                        >
                            Security settings
                        </Link>
                    </div>

                    <div className="mt-8 rounded-3xl bg-neutral-50 p-5">
                        <div className="flex items-center gap-3">
                            <FaUserShield className="text-rose-500" />

                            <div>
                                <p className="text-sm font-black text-neutral-950">
                                    Account role
                                </p>

                                <p className="text-sm text-neutral-500">{user.role}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <FaHome className="text-rose-500" />

                            <div>
                                <p className="text-sm font-black text-neutral-950">
                                    Hosting access
                                </p>

                                <p className="text-sm text-neutral-500">
                                    {user.role === "HOST" || user.role === "ADMIN"
                                        ? "Enabled"
                                        : "Request required"}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-neutral-950">
                            Personal information
                        </h2>

                        <p className="mt-2 text-sm text-neutral-500">
                            Keep your profile details accurate and up to date.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Field label="Full name" error={errors.name?.message}>
                            <input {...register("name")} className="input" />
                        </Field>

                        <Field label="Email" error={errors.email?.message}>
                            <input
                                type="email"
                                {...register("email")}
                                className="input"
                            />
                        </Field>

                        <Field label="Username" error={errors.username?.message}>
                            <input {...register("username")} className="input" />
                        </Field>

                        <Field label="Phone" error={errors.phone?.message}>
                            <input {...register("phone")} className="input" />
                        </Field>

                        <div className="md:col-span-2">
                            <Field label="Bio" error={errors.bio?.message}>
                                <textarea
                                    rows={5}
                                    {...register("bio")}
                                    className="input resize-none"
                                    placeholder="Tell guests or hosts a little about yourself..."
                                />
                            </Field>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={updateAccount.isPending}
                        className="mt-8 rounded-2xl bg-rose-500 px-8 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
                    >
                        {updateAccount.isPending ? "Saving..." : "Save changes"}
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