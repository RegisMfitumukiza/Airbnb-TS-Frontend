import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import {
    loginSchema,
    type LoginFormValues,
} from "../schemas/authSchemas";

export function LoginPage() {
    const { login, isLoggingIn, loginError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (values: LoginFormValues) => {
        login(values, {
            onSuccess: () => toast.success("Welcome back!"),
            onError: () => toast.error("Invalid email or password"),
        });
    };

    const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
            >
                <div className="mb-8 text-center">
                    <p className="text-sm font-semibold text-rose-500">Ruhuka</p>
                    <h1 className="text-3xl font-bold text-neutral-900 mt-2">
                        Welcome back
                    </h1>
                    <p className="text-neutral-500 mt-2">
                        Login to manage bookings, listings, and requests.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 rounded-2xl border border-neutral-200 py-3 font-semibold transition hover:bg-neutral-50"
                >
                    <FaGoogle />
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 my-6">
                    <div className="h-px bg-neutral-200 flex-1" />
                    <span className="text-sm text-neutral-400">or</span>
                    <div className="h-px bg-neutral-200 flex-1" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <label className="block">
                        <span className="text-sm font-medium text-neutral-700">Email</span>
                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 focus-within:border-rose-500">
                            <MdEmail className="text-neutral-400" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full outline-none text-neutral-900"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-rose-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-neutral-700">
                            Password
                        </span>
                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 focus-within:border-rose-500">
                            <MdLock className="text-neutral-400" />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full outline-none text-neutral-900"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-rose-500 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </label>

                    <div className="text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-bold text-rose-500 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {loginError && (
                        <p className="text-sm text-rose-500">
                            Login failed. Please check your credentials.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full rounded-2xl bg-rose-500 text-white py-3 font-semibold hover:bg-rose-600 disabled:opacity-60 transition"
                    >
                        {isLoggingIn ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-500 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="font-semibold text-rose-500">
                        Create account
                    </Link>
                </p>
            </motion.section>
        </main>
    );
}