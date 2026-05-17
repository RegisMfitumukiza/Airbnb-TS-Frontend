import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/authSchemas";

export function RegisterPage() {
  const { register: createAccount, isRegistering, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: RegisterFormValues) => {
    createAccount(values, {
      onSuccess: () => toast.success("Account created successfully!"),
      onError: () => toast.error("Registration failed. Please try again."),
    });
  };

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8"
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-rose-500">Airbnb Stays</p>
          <h1 className="text-3xl font-bold text-neutral-900 mt-2">
            Create your account
          </h1>
          <p className="text-neutral-500 mt-2">
            Join as a guest. You can request to become a host later.
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
            <span className="text-sm font-medium text-neutral-700">Name</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 focus-within:border-rose-500">
              <MdPerson className="text-neutral-400" />
              <input
                type="text"
                placeholder="Your full name"
                className="w-full outline-none text-neutral-900"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </label>

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
              Username
            </span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 focus-within:border-rose-500">
              <MdPerson className="text-neutral-400" />
              <input
                type="text"
                placeholder="choose username"
                className="w-full outline-none text-neutral-900"
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Phone</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 focus-within:border-rose-500">
              <MdPhone className="text-neutral-400" />
              <input
                type="tel"
                placeholder="0781234567"
                className="w-full outline-none text-neutral-900"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.phone.message}
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
                placeholder="Create password"
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

          <label className="block">
            <span className="text-sm font-medium text-neutral-700">
              Confirm Password
            </span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 focus-within:border-rose-500">
              <MdLock className="text-neutral-400" />
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full outline-none text-neutral-900"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>

          {registerError && (
            <p className="text-sm text-rose-500">
              Registration failed. Email or username may already exist.
            </p>
          )}

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full rounded-2xl bg-rose-500 text-white py-3 font-semibold hover:bg-rose-600 disabled:opacity-60 transition"
          >
            {isRegistering ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-rose-500">
            Login
          </Link>
        </p>
      </motion.section>
    </main>
  );
}