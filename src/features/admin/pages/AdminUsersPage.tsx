import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import {
  FaBan,
  FaEnvelope,
  FaEye,
  FaPhone,
  FaTimes,
  FaTrash,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { DashboardTopbar } from "../../../shared/components/DashboardTopbar";
import { Pagination } from "../../../shared/components/Pagination";
import { Spinner } from "../../../shared/components/Spinner";
import type { User } from "../../auth/types";
import { deleteAdminUser, getAdminUsers } from "../api/adminManagementApi";
import { useBanUser } from "../hooks/useBanUser";

type AdminUser = User & {
  isBanned?: boolean;
  bannedAt?: string | null;
  banReason?: string | null;
};

export function AdminUsersPage() {
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState("Fraudulent activity");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 5;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
  });

  const banUser = useBanUser();

  const deleteUser = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      toast.success("User deleted");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const filteredUsers = useMemo(() => {
    const normalized = search.toLowerCase().trim();

    return (users as AdminUser[]).filter((user) => {
      return (
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized) ||
        user.username.toLowerCase().includes(normalized) ||
        user.role.toLowerCase().includes(normalized)
      );
    });
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / limit) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  if (isLoading) return <Spinner />;

  return (
    <>
      <DashboardTopbar
        title="Users"
        subtitle="View users, inspect profiles, ban unsafe accounts, and remove accounts when needed."
        searchValue={search}
        searchPlaceholder="Search users..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-500">
            <FaUsers />
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-950">All users</h2>
            <p className="text-sm text-neutral-500">
              {filteredUsers.length} users found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500">
                <th className="py-3">User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => {
                const isAdmin = user.role === "ADMIN";
                const isBanned = Boolean(user.isBanned);

                return (
                  <tr key={user.id} className="border-b border-neutral-100">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-rose-50 font-black text-rose-500">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div>
                          <p className="font-black text-neutral-950">
                            {user.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="font-semibold text-neutral-800">
                      {user.email}
                    </td>

                    <td>{user.phone || "N/A"}</td>

                    <td>
                      <RoleBadge role={user.role} />
                    </td>

                    <td>
                      {isBanned ? (
                        <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-black text-white">
                          BANNED
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                          ACTIVE
                        </span>
                      )}
                    </td>

                    <td>{format(new Date(user.createdAt), "MMM d, yyyy")}</td>

                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-bold transition hover:border-rose-500 hover:text-rose-500"
                        >
                          <FaEye />
                          View
                        </button>

                        {!isAdmin && !isBanned && (
                          <button
                            type="button"
                            onClick={() => {
                              setBanTarget(user);
                              setBanReason("Fraudulent activity");
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 font-bold text-rose-500 transition hover:bg-rose-500 hover:text-white"
                          >
                            <FaBan />
                            Ban
                          </button>
                        )}

                        {!isAdmin && isBanned && (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-bold text-neutral-400"
                          >
                            <FaBan />
                            Banned
                          </button>
                        )}

                        {!isAdmin && (
                          <button
                            type="button"
                            disabled={deleteUser.isPending}
                            onClick={() => setDeleteTarget(user)}
                            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                          >
                            <FaTrash />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="rounded-3xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
              No users found.
            </div>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>

      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 grid place-items-center p-4">
          <DialogPanel className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <DialogTitle className="text-2xl font-black text-neutral-950">
                User details
              </DialogTitle>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 transition hover:bg-rose-500 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            {selectedUser && (
              <div>
                <div className="flex items-center gap-4 rounded-3xl bg-neutral-50 p-5">
                  <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-rose-50 text-xl font-black text-rose-500">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      selectedUser.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-neutral-950">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      @{selectedUser.username}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <DetailItem
                    icon={<FaEnvelope />}
                    label="Email"
                    value={selectedUser.email}
                  />

                  <DetailItem
                    icon={<FaPhone />}
                    label="Phone"
                    value={selectedUser.phone || "N/A"}
                  />

                  <DetailItem
                    icon={<FaUserShield />}
                    label="Role"
                    value={selectedUser.role}
                  />

                  <DetailItem
                    icon={<FaBan />}
                    label="Status"
                    value={
                      selectedUser.isBanned
                        ? `BANNED${
                            selectedUser.banReason
                              ? ` - ${selectedUser.banReason}`
                              : ""
                          }`
                        : "ACTIVE"
                    }
                  />

                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
                      Bio
                    </p>
                    <p className="mt-1 text-sm text-neutral-700">
                      {selectedUser.bio || "No bio provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(banTarget)}
        onClose={() => setBanTarget(null)}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 grid place-items-center p-4">
          <DialogPanel className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <DialogTitle className="text-2xl font-black text-neutral-950">
              Ban user?
            </DialogTitle>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              This will block the user from accessing the platform. If the user
              is a host, their listings will be hidden and related bookings will
              be cancelled by the backend.
            </p>

            {banTarget && (
              <div className="mt-5 rounded-3xl bg-neutral-50 p-4">
                <p className="font-black text-neutral-950">{banTarget.name}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {banTarget.email}
                </p>
                <p className="mt-2 text-xs font-bold text-neutral-500">
                  Role: {banTarget.role}
                </p>
              </div>
            )}

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-neutral-700">
                Reason
              </span>

              <textarea
                rows={4}
                value={banReason}
                onChange={(event) => setBanReason(event.target.value)}
                className="input resize-none"
                placeholder="Reason for banning this user..."
              />
            </label>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setBanTarget(null)}
                className="flex-1 rounded-2xl border border-neutral-200 px-5 py-3 font-bold transition hover:border-rose-500 hover:text-rose-500"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={banUser.isPending || !banTarget || !banReason.trim()}
                onClick={() => {
                  if (!banTarget) return;

                  banUser.mutate(
                    {
                      id: banTarget.id,
                      payload: {
                        reason: banReason.trim(),
                      },
                    },
                    {
                      onSuccess: () => {
                        setBanTarget(null);
                        setBanReason("Fraudulent activity");
                      },
                    }
                  );
                }}
                className="flex-1 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                Ban user
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 grid place-items-center p-4">
          <DialogPanel className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <DialogTitle className="text-2xl font-black text-neutral-950">
              Delete user?
            </DialogTitle>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              This action cannot be undone. Use ban instead when you only want
              to restrict access without removing the account.
            </p>

            {deleteTarget && (
              <div className="mt-5 rounded-3xl bg-neutral-50 p-4">
                <p className="font-black text-neutral-950">
                  {deleteTarget.name}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {deleteTarget.email}
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-2xl border border-neutral-200 px-5 py-3 font-bold transition hover:border-rose-500 hover:text-rose-500"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteUser.isPending || !deleteTarget}
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteUser.mutate(deleteTarget.id);
                }}
                className="flex-1 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

type RoleBadgeProps = {
  role: string;
};

function RoleBadge({ role }: RoleBadgeProps) {
  const className =
    role === "ADMIN"
      ? "bg-neutral-950 text-white"
      : role === "HOST"
        ? "bg-rose-50 text-rose-500"
        : "bg-neutral-100 text-neutral-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {role}
    </span>
  );
}

type DetailItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4">
      <div className="text-rose-500">{icon}</div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-neutral-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}