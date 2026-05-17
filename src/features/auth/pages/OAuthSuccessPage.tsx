import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../lib/api";

export function OAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            toast.error("Google authentication failed");
            navigate("/login");
            return;
        }

        localStorage.setItem("token", token);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        const redirectUser = async () => {
            try {
                const response = await api.get("/auth/me");

                const user = response.data.data;

                toast.success("Logged in successfully");

                if (user.role === "ADMIN") {
                    navigate("/admin/dashboard", { replace: true });
                    return;
                }

                if (user.role === "HOST") {
                    navigate("/host/dashboard", { replace: true });
                    return;
                }

                navigate("/listings", { replace: true });
            } catch {
                toast.error("Authentication failed");
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        redirectUser();
    }, [navigate, searchParams]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-6">
            <div className="rounded-4xl border border-neutral-200 bg-white p-10 text-center shadow-xl shadow-neutral-200/60">
                <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-neutral-200 border-t-rose-500" />

                <h1 className="mt-6 text-2xl font-black text-neutral-950">
                    Completing login...
                </h1>

                <p className="mt-3 text-neutral-500">
                    Please wait while we authenticate your account.
                </p>
            </div>
        </main>
    );
}