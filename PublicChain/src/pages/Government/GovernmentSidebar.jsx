import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaMoneyCheckAlt,
  FaProjectDiagram,
  FaLink,
  FaUserShield,
} from "react-icons/fa";

// Keeping the link data structure as provided
const links = [
  {
    to: "/government/dashboard",
    label: "Dashboard",
    icon: <FaChartLine />,
  },
  {
    to: "/government/fund-release",
    label: "Fund Releases",
    icon: <FaMoneyCheckAlt />,
  },
  {
    to: "/government/fund-requests",
    label: "Department Fund Requests",
    icon: <FaMoneyCheckAlt />,
  },
  {
    to: "/government/government-projects",
    label: "Projects",
    icon: <FaProjectDiagram />,
  },
  {
    to: "/government/govt-blockchain",
    label: "Blockchain",
    icon: <FaLink />,
  },
];

export default function GovernmentSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800/80 shadow-2xl shadow-black/60 px-5 py-7 flex flex-col relative overflow-hidden">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-10 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />

      {/* Header / Logo area */}
      <div className="relative z-10 mb-8 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/60 bg-sky-500/15 shadow-lg shadow-sky-900/40">
            <span className="text-sky-300">
              <FaUserShield className="text-lg" />
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-50 tracking-tight">
              Official Portal
            </h2>
            <p className="text-[11px] uppercase tracking-[0.18em] text-sky-300/80 mt-1">
              Administration Console
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                relative flex items-center gap-3 px-4 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-300
                group
                ${
                  isActive
                    ? "bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-900/60"
                    : "text-slate-200 hover:bg-slate-900/80 border border-transparent hover:border-slate-700/80"
                }
              `}
            >
              {/* Left accent bar for active item */}
              {isActive && (
                <span className="absolute -left-1 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-cyan-300 shadow shadow-cyan-500/60" />
              )}

              <span
                className={`
                  text-lg transition-all duration-300 flex items-center justify-center
                  ${
                    isActive
                      ? "text-white scale-110"
                      : "text-sky-300 group-hover:text-cyan-300"
                  }
                `}
              >
                {link.icon}
              </span>

              <span className="truncate">{link.label}</span>

              {/* Right chevron hint */}
              <span
                className={`
                  ml-auto text-xs opacity-0 transform translate-x-1
                  group-hover:opacity-100 group-hover:translate-x-0 transition-all
                  ${isActive ? "text-white/80" : "text-slate-400"}
                `}
              >
                →
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative z-10 mt-auto pt-5 border-t border-slate-800/80">
        <p className="text-[11px] text-slate-400 font-light text-center leading-relaxed">
          Secured by{" "}
          <span className="font-medium text-sky-300">Government Trust</span>
          <br />
          <span className="text-[10px] text-slate-500">
            Blockchain-enabled transparency
          </span>
        </p>
      </div>
    </aside>
  );
}
