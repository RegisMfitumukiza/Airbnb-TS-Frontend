import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaBell,
    FaCalendarCheck,
    FaClipboardList,
    FaExclamationCircle,
    FaHome,
    FaShieldAlt,
    FaUsers,
} from "react-icons/fa";

import { Spinner } from "../../../shared/components/Spinner";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAdminStats } from "../../admin/hooks/useAdminStats";

const quickActions = [
    {
        title: "Review host requests",
        description: "Approve or reject pending guest applications.",
        icon: <FaClipboardList />,
        to: "/admin/host-requests",
    },
    {
        title: "Manage users",
        description: "Inspect users, ban unsafe accounts, and manage roles.",
        icon: <FaUsers />,
        to: "/admin/users",
    },
    {
        title: "Moderate listings",
        description: "Review platform listings and manage property content.",
        icon: <FaHome />,
        to: "/admin/listings",
    },
];

export function AdminDashboard() {
    const { user } = useAuth();
    const { data: stats, isLoading } = useAdminStats();

    if (isLoading) return <Spinner />;

    const totalUsers = stats?.totalUsers ?? 0;
    const totalListings = stats?.totalListings ?? 0;
    const totalBookings = stats?.totalBookings ?? 0;
    const totalHostRequests = stats?.totalHostRequests ?? 0;
    const pendingHostRequests = stats?.pendingHostRequests ?? 0;
    const totalNotifications = stats?.totalNotifications ?? 0;

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] bg-neutral-950 p-10 text-white">
                <p className="text-sm font-extrabold uppercase tracking-wide text-rose-400">
                    Admin dashboard
                </p>

                <h1 className="mt-3 text-4xl font-black md:text-5xl">
                    Welcome, {user?.name || "Admin"}
                </h1>

                <p className="mt-4 max-w-2xl text-neutral-300">
                    Review host requests, manage users, moderate listings, and monitor
                    platform activity.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        to="/admin/host-requests"
                        className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 font-bold text-white transition hover:bg-rose-600"
                    >
                        <FaClipboardList />
                        Review requests
                    </Link>

                    <Link
                        to="/admin/notifications"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-neutral-950 transition hover:bg-rose-50"
                    >
                        <FaBell />
                        View alerts
                    </Link>
                </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    title="Users"
                    value={totalUsers}
                    icon={<FaUsers />}
                    description="Registered accounts"
                    badge="Manage"
                    to="/admin/users"
                />

                <StatCard
                    title="Listings"
                    value={totalListings}
                    icon={<FaHome />}
                    description="Platform properties"
                    badge="Moderate"
                    to="/admin/listings"
                />

                <StatCard
                    title="Bookings"
                    value={totalBookings}
                    icon={<FaCalendarCheck />}
                    description="All reservations"
                    badge="Review"
                    to="/admin/bookings"
                />

                <StatCard
                    title="Requests"
                    value={totalHostRequests}
                    icon={<FaClipboardList />}
                    description={`${pendingHostRequests} pending`}
                    badge={pendingHostRequests > 0 ? "Pending" : "Clear"}
                    highlight={pendingHostRequests > 0}
                    to="/admin/host-requests"
                />

                <StatCard
                    title="Alerts"
                    value={totalNotifications}
                    icon={<FaBell />}
                    description="Notifications"
                    badge={totalNotifications > 0 ? "Review" : "Clear"}
                    highlight={totalNotifications > 0}
                    to="/admin/notifications"
                />
            </section>

            <section className="grid gap-5 md:grid-cols-3">
                <ModerationCard
                    icon={<FaExclamationCircle />}
                    title="Pending host requests"
                    value={pendingHostRequests}
                    description="Applications waiting for admin review."
                    to="/admin/host-requests"
                />

                <ModerationCard
                    icon={<FaBell />}
                    title="Notifications"
                    value={totalNotifications}
                    description="Platform alerts and account updates."
                    to="/admin/notifications"
                />

                <ModerationCard
                    icon={<FaShieldAlt />}
                    title="Platform listings"
                    value={totalListings}
                    description="Listings currently on the platform."
                    to="/admin/listings"
                    highlight={false}
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-neutral-950">
                        Quick moderation actions
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                        Jump directly to common admin tasks.
                    </p>

                    <div className="mt-5 grid gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                to={action.to}
                                className="flex items-center gap-4 rounded-2xl border border-neutral-100 p-4 transition hover:border-rose-200 hover:bg-rose-50/40"
                            >
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-xl text-rose-500">
                                    {action.icon}
                                </div>

                                <div>
                                    <h3 className="font-black text-neutral-950">
                                        {action.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        {action.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-neutral-950">
                        Recent activity
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                        Current platform snapshot based on live totals.
                    </p>

                    <div className="mt-5 space-y-4">
                        <ActivityItem
                            icon={<FaUsers />}
                            title={`${totalUsers} registered users`}
                            description="Accounts currently available on the platform."
                            to="/admin/users"
                        />

                        <ActivityItem
                            icon={<FaHome />}
                            title={`${totalListings} active listings`}
                            description="Properties visible or managed in the system."
                            to="/admin/listings"
                        />

                        <ActivityItem
                            icon={<FaCalendarCheck />}
                            title={`${totalBookings} bookings recorded`}
                            description="Reservations created by guests."
                            to="/admin/bookings"
                        />

                        <ActivityItem
                            icon={<FaClipboardList />}
                            title={`${pendingHostRequests} pending host requests`}
                            description={`${totalHostRequests} total host applications submitted.`}
                            to="/admin/host-requests"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

type StatCardProps = {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
    badge: string;
    to: string;
    highlight?: boolean;
};

function StatCard({
    title,
    value,
    icon,
    description,
    badge,
    to,
    highlight = false,
}: StatCardProps) {
    return (
        <motion.div whileHover={{ y: -4 }}>
            <Link
                to={to}
                className={`block h-full rounded-[2rem] border bg-white p-6 shadow-sm transition hover:shadow-xl hover:shadow-neutral-200/70 ${highlight
                        ? "border-rose-200"
                        : "border-neutral-200 hover:border-rose-200"
                    }`}
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-xl text-rose-500">
                        {icon}
                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${highlight
                                ? "bg-rose-50 text-rose-500"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                    >
                        {badge}
                    </span>
                </div>

                <p className="mt-6 text-4xl font-black text-neutral-950">{value}</p>

                <h3 className="mt-2 text-sm font-black uppercase tracking-wide text-neutral-900">
                    {title}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">{description}</p>
            </Link>
        </motion.div>
    );
}

type ModerationCardProps = {
    icon: React.ReactNode;
    title: string;
    value: number;
    description: string;
    to: string;
    highlight?: boolean;
};

function ModerationCard({
    icon,
    title,
    value,
    description,
    to,
    highlight = false,
}: ModerationCardProps) {
    const needsAttention = highlight;

    return (
        <Link
            to={to}
            className={`rounded-[2rem] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-200/70 ${needsAttention
                    ? "border-rose-200 bg-rose-50/40"
                    : "border-neutral-200 bg-white"
                }`}
        >
            <div
                className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${needsAttention
                        ? "bg-rose-100 text-rose-500"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
            >
                {icon}
            </div>

            <p className="mt-5 text-3xl font-black text-neutral-950">{value}</p>

            <h3 className="mt-2 text-lg font-black text-neutral-950">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
        </Link>
    );
}

type ActivityItemProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    to: string;
};

function ActivityItem({ icon, title, description, to }: ActivityItemProps) {
    return (
        <Link
            to={to}
            className="flex items-center gap-4 rounded-2xl border border-neutral-100 p-4 transition hover:border-rose-200 hover:bg-rose-50/40"
        >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                {icon}
            </div>

            <div>
                <p className="font-black text-neutral-950">{title}</p>
                <p className="mt-1 text-sm text-neutral-500">{description}</p>
            </div>
        </Link>
    );
}