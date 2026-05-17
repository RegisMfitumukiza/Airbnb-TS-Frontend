import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaClipboardCheck,
  FaCommentDots,
  FaHome,
  FaShieldAlt,
  FaUserCheck,
} from "react-icons/fa";

import { DashboardTopbar } from "../../../shared/components/DashboardTopbar";
import { Pagination } from "../../../shared/components/Pagination";
import { Spinner } from "../../../shared/components/Spinner";

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../hooks/useNotifications";

function getNotificationIcon(type: string) {
  switch (type) {
    case "HOST_APPROVED":
      return <FaUserCheck />;

    case "BOOKING_CREATED":
    case "BOOKING_CANCELLED":
      return <FaClipboardCheck />;

    case "NEW_REVIEW":
      return <FaCommentDots />;

    case "HOST_REQUEST":
      return <FaHome />;

    default:
      return <FaShieldAlt />;
  }
}

function formatNotificationType(type: string) {
  return type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function NotificationsPage() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 5;

  const { data: notifications = [], isLoading } = useNotifications();

  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const filteredNotifications = useMemo(() => {
    const normalized = search.toLowerCase().trim();

    return notifications.filter((notification) => {
      return (
        notification.title.toLowerCase().includes(normalized) ||
        notification.message.toLowerCase().includes(normalized) ||
        notification.type.toLowerCase().includes(normalized)
      );
    });
  }, [notifications, search]);

  const unreadCount = filteredNotifications.filter(
    (notification) => !notification.isRead
  ).length;

  const totalPages = Math.ceil(filteredNotifications.length / limit) || 1;

  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * limit,
    page * limit
  );

  if (isLoading) return <Spinner />;

  return (
    <>
      <DashboardTopbar
        title="Notifications"
        subtitle={
          isAdminRoute
            ? "Review platform alerts and moderation updates."
            : "Review your hosting and account notifications."
        }
        searchValue={search}
        searchPlaceholder="Search notifications..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
              <FaBell />
            </div>

            <div>
              <h2 className="text-2xl font-black text-neutral-950">
                Notifications
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-medium text-neutral-500">
                  {filteredNotifications.length}{" "}
                  {filteredNotifications.length === 1
                    ? "notification"
                    : "notifications"}
                </span>

                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-500">
                  {unreadCount} unread
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={markAll.isPending || unreadCount === 0}
            onClick={() => markAll.mutate()}
            className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all read
          </button>
        </div>

        <div className="space-y-4">
          {paginatedNotifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-[2rem] border p-5 transition ${
                notification.isRead
                  ? "border-neutral-200 bg-white"
                  : "border-rose-100 bg-rose-50/40"
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div
                    className={`mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg ${
                      notification.isRead
                        ? "bg-neutral-100 text-neutral-500"
                        : "bg-rose-100 text-rose-500"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-neutral-950">
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          notification.isRead
                            ? "bg-neutral-100 text-neutral-600"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {formatNotificationType(notification.type)}
                      </span>
                    </div>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
                      {notification.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-400">
                      <span>
                        {format(
                          new Date(notification.createdAt),
                          "MMM d, yyyy"
                        )}
                      </span>

                      {notification.isRead && notification.readAt && (
                        <span>
                          Read{" "}
                          {format(
                            new Date(notification.readAt),
                            "MMM d, yyyy"
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!notification.isRead && (
                  <button
                    type="button"
                    disabled={markOne.isPending}
                    onClick={() => markOne.mutate(notification.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold transition hover:border-rose-500 hover:text-rose-500 disabled:opacity-50"
                  >
                    <FaCheckCircle />
                    Mark read
                  </button>
                )}
              </div>
            </article>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-neutral-300 p-14 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-neutral-100 text-2xl text-neutral-400">
                <FaBell />
              </div>

              <h3 className="mt-5 text-xl font-black text-neutral-900">
                No notifications found
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                You're all caught up right now.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>
    </>
  );
}