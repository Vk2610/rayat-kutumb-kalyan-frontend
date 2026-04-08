import { FaUser, FaWpforms, FaSearchLocation } from "react-icons/fa";
import { MdHistory, MdQueryStats } from "react-icons/md";
import { SiGoogleforms } from "react-icons/si";
import { GiReceiveMoney } from "react-icons/gi";
import { LuFileSpreadsheet, LuPlus, LuSettings } from "react-icons/lu";

// ---------------- USER LINKS ----------------
export const USER_LINKS = [
    {
        key: "Profile",
        label: "Profile",
        Path: "/user/profile",
        icon: FaUser,
        formType: "common",
    },
    {
        key: "Form",
        label: "Welfare Form",
        Path: "/user/wf-form",
        icon: FaWpforms,
        formType: "common",
    },
    {
        key: "MyApplications",
        label: "My Applications",
        Path: "/user/my-applications",
        icon: MdHistory,
        formType: "welfare",
    },
];

// ---------------- SUB-ADMIN LINKS ----------------
export const SUBADMIN_LINKS = [
    {
        key: "Profile",
        label: "Profile",
        Path: "/sub-admin/profile",
        icon: FaUser,
        formType: "profile",
    },
    {
        key: "ManageApplications",
        label: "Manage Applications",
        Path: "/sub-admin/manage-applications",
        icon: SiGoogleforms,
        formType: "manageApplications",
    },
    {
        key: "FundStats",
        label: "Fund Stats",
        Path: "/sub-admin/fund-stats",
        icon: MdQueryStats,
        formType: "fundStats",
    },
    {
        key: "History",
        label: "History",
        Path: "/sub-admin/history",
        icon: MdHistory,
        formType: "history",
    },
];

// ---------------- ADMIN LINKS ----------------
export const ADMIN_LINKS = [
    {
        key: "Profile",
        label: "Profile",
        Path: "/admin/welfare-profile",
        icon: FaUser,
        formType: "welfare",
    },
    {
        key: "Profile",
        label: "Profile",
        Path: "/admin/rkky-profile",
        icon: FaUser,
        formType: "rkky",
    },
    {
        key: "Manage Funds",
        label: "Manage Funds",
        Path: "/admin/manage-funds",
        icon: LuFileSpreadsheet,
        formType: "rkky",
    },
    {
        key: "FormApproval",
        label: "Form Approval",
        Path: "/admin/form-approval",
        icon: GiReceiveMoney,
        formType: "welfare",
    },
    {
        key: "ApprovedApplications",
        label: "Approved Applications",
        Path: "/admin/approved-applications",
        icon: FaSearchLocation,
        formType: "welfare",
    },
    // {
    //     key: "View Profile",
    //     label: "View Profile",
    //     Path: "/admin/view-profile",
    //     icon: LuFileSpreadsheet,
    //     formType: "rkky",
    // },
    {
        key: "Add New User",
        label: "New User",
        Path: "/admin/new-user",
        icon: LuPlus,
        formType: "rkky",
    },
    {
        key: "Update User",
        label: "Update User",
        Path: "/admin/update-user",
        icon: LuSettings,
        formType: "rkky",
    },
    {
        key: "History",
        label: "History",
        Path: "/admin/history",
        icon: MdHistory,
        formType: "welfare",
    }
];

// ---------------- LOGOUT HANDLER ----------------
export const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('formType');
    window.location.href = '/';
};
