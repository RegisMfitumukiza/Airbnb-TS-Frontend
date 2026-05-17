import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { Navbar } from "./shared/components/Navbar";
import { NotFound } from "./shared/components/NotFound";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { RoleRedirect } from "./shared/components/RoleRedirect";

import { DashboardLayout } from "./layouts/DashboardLayout";
import { ChatWidget } from "./features/ai/components/ChatWidget";

import {
  ListingsPage,
  ListingDetail,
  CreateListingPage,
  HostListingsPage,
  ListingImagesPage,
  EditListingPage,
  HostListingDetailPage,
} from "./features/listings";

import { LoginPage, RegisterPage, OAuthSuccessPage } from "./features/auth";

import {
  AccountPage,
  SecurityPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./features/account";

import { BecomeHostPage, AdminHostRequestsPage } from "./features/hostRequests";

import { HostDashboard } from "./features/dashboard/pages/HostDashboard";
import { AdminDashboard } from "./features/dashboard/pages/AdminDashboard";

import {
  AdminUsersPage,
  AdminListingsPage,
  AdminListingDetailPage,
} from "./features/admin";

import { NotificationsPage } from "./features/notifications";

import {
  AdminBookingsPage,
  HostBookingsPage,
  MyBookingsPage,
} from "./features/bookings";

import { AdminReviewsPage } from "./features/reviews";

const App = () => {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/host");

  return (
    <>
      {!isDashboardRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/listings" replace />} />

        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingDetail />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<RoleRedirect />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["GUEST", "HOST"]} />}>
          <Route path="/become-host" element={<BecomeHostPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["GUEST", "HOST", "ADMIN"]} />
          }
        >
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/security" element={<SecurityPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<DashboardLayout variant="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="host-requests" element={<AdminHostRequestsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="listings" element={<AdminListingsPage />} />
            <Route path="listings/:id" element={<AdminListingDetailPage />} />
            <Route path="listings/:id/edit" element={<EditListingPage />} />
            <Route path="listings/:id/images" element={<ListingImagesPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />

            <Route path="account" element={<AccountPage />} />
            <Route path="account/security" element={<SecurityPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["HOST", "ADMIN"]} />}>
          <Route path="/host" element={<DashboardLayout variant="host" />}>
            <Route index element={<HostDashboard />} />
            <Route path="listings" element={<HostListingsPage />} />
            <Route path="listings/create" element={<CreateListingPage />} />
            <Route path="listings/:id" element={<HostListingDetailPage />} />
            <Route path="listings/:id/images" element={<ListingImagesPage />} />
            <Route path="listings/:id/edit" element={<EditListingPage />} />
            <Route path="bookings" element={<HostBookingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />

            <Route path="account" element={<AccountPage />} />
            <Route path="account/security" element={<SecurityPage />} />
          </Route>
        </Route>

        <Route
          path="/guest/dashboard"
          element={<Navigate to="/account" replace />}
        />
        <Route path="/host/dashboard" element={<Navigate to="/host" replace />} />
        <Route
          path="/admin/dashboard"
          element={<Navigate to="/admin" replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isDashboardRoute && <ChatWidget />}
    </>
  );
};

export default App;