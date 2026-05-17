import {
    FaBell,
    FaClipboardList,
    FaHome,
    FaList,
    FaPlus,
    FaTachometerAlt,
    FaUsers,
    FaCalendarCheck,
    FaCommentDots,
} from "react-icons/fa";

export type DashboardVariant = "admin" | "host";

export type DashboardLink = {
    label: string;
    to: string;
    icon: React.ReactNode;
    isNotification?: boolean;
    end?: boolean;
};

type DashboardConfigItem = {
  roleLabel: string;
  basePath: string;
  notificationPath: string;
  imageHint: string | null;
  links: DashboardLink[];
};

export const dashboardConfig: Record<DashboardVariant, DashboardConfigItem> = {
    admin: {
        roleLabel: "Admin",
        basePath: "/admin",
        notificationPath: "/admin/notifications",
        imageHint: null,
        links: [
            { label: "Overview", to: "/admin", icon: <FaTachometerAlt /> },
            {
                label: "Host Requests",
                to: "/admin/host-requests",
                icon: <FaClipboardList />,
            },
            { label: "Users", to: "/admin/users", icon: <FaUsers /> },
            { label: "Listings", to: "/admin/listings", icon: <FaHome /> },
            {
                label: "Bookings",
                to: "/admin/bookings",
                icon: <FaCalendarCheck />,
            },
            {
                label: "Notifications",
                to: "/admin/notifications",
                icon: <FaBell />,
                isNotification: true,
            },
            {
                label: "Reviews",
                to: "/admin/reviews",
                icon: <FaCommentDots />,
            },
        ] satisfies DashboardLink[],
    },

    host: {
        roleLabel: "Host",
        basePath: "/host",
        notificationPath: "/host/notifications",
        imageHint: null,
        links: [
            { label: "Overview", to: "/host", icon: <FaTachometerAlt />, end: true },
            { label: "My Listings", to: "/host/listings", icon: <FaList />, end: true },
            { label: "Create Listing", to: "/host/listings/create", icon: <FaPlus />, end: true },
            {
                label: "Notifications",
                to: "/host/notifications",
                icon: <FaBell />,
                isNotification: true,
            },
            {
                label: "Bookings",
                to: "/host/bookings",
                icon: <FaCalendarCheck />,
            },
        ] satisfies DashboardLink[],
    },
};