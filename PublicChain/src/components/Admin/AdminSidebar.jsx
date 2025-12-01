import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserCheck,
  FaFolderOpen,
  FaMoneyCheckAlt,
  FaCommentDots,
  FaHourglassHalf,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: FaTachometerAlt },
  { label: "Verified Users", to: "/admin/verified-users", icon: FaUserCheck },
  { label: "All Projects", to: "/admin/all-projects", icon: FaFolderOpen },
  { label: "Fund Requests", to: "/admin/fund-requests", icon: FaMoneyCheckAlt },
  { label: "Feedbacks", to: "/admin/feedback", icon: FaCommentDots },
  {
    label: "Pending Registrations",
    to: "/admin/pending-registrations",
    icon: FaHourglassHalf,
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="min-h-screen w-64 bg-gradient-to-b from-[#151842] via-[#050816] to-[#020617] text-white shadow-2xl flex flex-col py-8 px-5 border-r border-indigo-700/70 relative overflow-hidden">
      {/* subtle glow background */}
      <div className="pointer-events-none absolute -top-16 -right-20 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Header */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-400 via-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 text-xl font-black">
            PC
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-indigo-300/80">
              Admin Panel
            </div>
            <div className="text-lg font-semibold tracking-wide text-indigo-50">
              PublicChain
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 relative z-10">
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={label}
              to={to}
              className={`group px-4 py-3 rounded-xl font-semibold text-sm transition-all text-left mb-1 flex items-center gap-3 border
                ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-slate-50 border-indigo-300 shadow-lg shadow-indigo-700/40"
                    : "bg-white/5 text-indigo-200 border-white/5 hover:border-indigo-400/60 hover:bg-indigo-800/60 hover:text-blue-100"
                }`}
            >
              <span
                className={`p-2 rounded-lg flex items-center justify-center transition-all
                  ${
                    active
                      ? "bg-black/20"
                      : "bg-black/30 group-hover:bg-black/10"
                  }`}
              >
                <Icon className="text-lg" />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
