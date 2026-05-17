import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaHome, FaTimes } from "react-icons/fa";

import { useAuth } from "../../features/auth/hooks/useAuth";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold transition ${
      isActive ? "text-rose-500" : "text-neutral-700 hover:text-rose-500"
    }`;

  const dashboardPath =
    user?.role === "ADMIN" ? "/admin" : user?.role === "HOST" ? "/host" : null;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          to="/listings"
          className="flex items-center gap-3 text-2xl font-black text-rose-500"
        >
          <FaHome />
          Ruhuka
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/listings" className={linkClass}>
            Stays
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink to="/become-host" className={linkClass}>
                Become a host
              </NavLink>

              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
              >
                Register
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === "GUEST" && (
            <>
              <NavLink to="/become-host" className={linkClass}>
                Become a host
              </NavLink>

              <NavLink to="/my-bookings" className={linkClass}>
                Trips
              </NavLink>
            </>
          )}

          {dashboardPath && (
            <NavLink to={dashboardPath} className={linkClass}>
              {user?.role === "ADMIN" ? "Admin Dashboard" : "Host Dashboard"}
            </NavLink>
          )}

          {isAuthenticated && (
            <>
              <NavLink to="/account" className={linkClass}>
                Profile
              </NavLink>

              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-500"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="grid h-11 w-11 place-items-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-rose-500 hover:text-rose-500 md:hidden"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="border-t border-neutral-200 bg-white md:hidden"
          >
            <div className="flex flex-col gap-5 px-6 py-6">
              <NavLink to="/listings" onClick={closeMenu} className={linkClass}>
                Stays
              </NavLink>

              {!isAuthenticated && (
                <>
                  <NavLink
                    to="/become-host"
                    onClick={closeMenu}
                    className={linkClass}
                  >
                    Become a host
                  </NavLink>

                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className={linkClass}
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-full bg-rose-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-rose-600"
                  >
                    Register
                  </NavLink>
                </>
              )}

              {isAuthenticated && user?.role === "GUEST" && (
                <>
                  <NavLink
                    to="/become-host"
                    onClick={closeMenu}
                    className={linkClass}
                  >
                    Become a host
                  </NavLink>

                  <NavLink
                    to="/my-bookings"
                    onClick={closeMenu}
                    className={linkClass}
                  >
                    Trips
                  </NavLink>
                </>
              )}

              {dashboardPath && (
                <NavLink
                  to={dashboardPath}
                  onClick={closeMenu}
                  className={linkClass}
                >
                  {user?.role === "ADMIN" ? "Admin Dashboard" : "Host Dashboard"}
                </NavLink>
              )}

              {isAuthenticated && (
                <>
                  <NavLink
                    to="/account"
                    onClick={closeMenu}
                    className={linkClass}
                  >
                    Profile
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}