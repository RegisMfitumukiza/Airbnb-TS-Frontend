import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FaBars,
  FaImages,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

import { useAuth } from "../features/auth/hooks/useAuth";
import { useUnreadNotifications } from "../features/notifications/hooks/useNotifications";
import {
  dashboardConfig,
  type DashboardVariant,
} from "./dashboardConfig";

type DashboardLayoutProps = {
  variant: DashboardVariant;
};

export function DashboardLayout({ variant }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { data: unreadCount = 0 } = useUnreadNotifications();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const config = dashboardConfig[variant];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 transition hover:border-rose-500 hover:text-rose-500"
          >
            <FaBars />
          </button>

          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
              {config.roleLabel}
            </p>
            <h2 className="text-lg font-black text-neutral-950">Dashboard</h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <SidebarContent
              user={user}
              logout={logout}
              config={config}
              unreadCount={unreadCount}
            />
          </aside>

          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />

                <motion.aside
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{ type: "spring", damping: 22 }}
                  className="fixed left-0 top-0 z-50 h-screen w-[300px] bg-white p-4 shadow-2xl lg:hidden"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                        {config.roleLabel}
                      </p>
                      <h2 className="text-xl font-black text-neutral-950">
                        Dashboard
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <SidebarContent
                    user={user}
                    logout={logout}
                    config={config}
                    unreadCount={unreadCount}
                    onNavigate={() => setSidebarOpen(false)}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0"
          >
            <Outlet />
          </motion.section>
        </div>
      </div>
    </main>
  );
}

type SidebarProps = {
  user?: {
    name?: string;
    email?: string;
    avatar?: string | null;
    role?: string;
  } | null;
  logout: () => void;
  config: (typeof dashboardConfig)["admin"] | (typeof dashboardConfig)["host"];
  unreadCount: number;
  onNavigate?: () => void;
};

function SidebarContent({
  user,
  logout,
  config,
  unreadCount,
  onNavigate,
}: SidebarProps) {
  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
      <div className="mb-5 rounded-3xl bg-neutral-950 p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">
          {config.roleLabel}
        </p>

        <h2 className="mt-2 text-xl font-black">{user?.name || "User"}</h2>

        <p className="mt-1 truncate text-sm text-neutral-300">{user?.email}</p>
      </div>

      <nav className="space-y-2">
        {config.links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end ?? link.to === config.basePath}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                isActive
                  ? "border-rose-200 bg-rose-50 text-rose-500"
                  : "border-transparent text-neutral-700 hover:bg-neutral-50 hover:text-rose-500"
              }`
            }
          >
            <span className="flex w-full items-center gap-3">
              {link.icon}
              {link.label}

              {link.isNotification && unreadCount > 0 && (
                <span className="ml-auto grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
          </NavLink>
        ))}
      </nav>

      {config.imageHint && (
        <div className="mt-5 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
          <FaImages className="mb-2" />
          {config.imageHint}
        </div>
      )}

      <div className="mt-auto border-t border-neutral-200 pt-4">
        <Link
          to={`${config.basePath}/account`}
          onClick={onNavigate}
          className="mb-3 flex items-center gap-3 rounded-3xl bg-neutral-50 p-3 transition hover:bg-rose-50"
        >
          <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-rose-50 text-rose-500">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-2xl" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-neutral-950">
              {user?.name || "User"}
            </p>
            <p className="text-xs font-bold text-neutral-500">
              {user?.role || config.roleLabel}
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}