import {
  FaHome,
  FaFolderOpen,
  FaMapMarkedAlt,
  FaCommentDots,
  FaLink,
  FaKey, // ✅ NEW icon
} from "react-icons/fa";

export default function Sidebar({ active = "Dashboard" }) {
  return (
    <aside className="relative bg-slate-50 border-r border-slate-200 text-slate-900 w-72 min-h-screen flex flex-col py-8 px-5 shadow-sm overflow-hidden">
      {/* soft decorative shapes */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Brand / Emblem */}
      <div className="relative z-10 mb-8 flex items-center gap-3 px-1 border-b border-slate-200 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center shadow-md shadow-sky-900/30">
          {/* emblem */}
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <div>
          <span className="font-semibold text-base text-slate-900 tracking-tight">
            PublicChain Portal
          </span>
          <p className="text-[11px] text-slate-500">
            Citizen Transparency Dashboard
          </p>
        </div>
      </div>

      {/* Section label */}
      <div className="relative z-10 px-1 mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Navigation
        </span>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex flex-col gap-1">
        <SidebarButton
          label="Dashboard"
          active={active === "Dashboard"}
          href="/public"
          icon={<FaHome className="w-5 h-5" />}
        />
        <SidebarButton
          label="View All Projects"
          active={active === "View All Projects"}
          href="/public/view-all-projects"
          icon={<FaFolderOpen className="w-5 h-5" />}
        />
        <SidebarButton
          label="Track by Location/Dept"
          active={active === "Track by Location/Dept"}
          href="/public/track-by-location-dept"
          icon={<FaMapMarkedAlt className="w-5 h-5" />}
        />
        <SidebarButton
          label="Blockchain Explorer"
          active={active === "Blockchain Explorer"}
          href="/public/blockchain-explorer"
          icon={<FaLink className="w-5 h-5" />}
        />
        <SidebarButton
          label="Submit Feedback"
          active={active === "Submit Feedback"}
          href="/public/submit-feedback"
          icon={<FaCommentDots className="w-5 h-5" />}
        />

        {/* ✅ NEW: Zero Knowledge menu item */}
        <SidebarButton
          label="Zero Knowledge"
          active={active === "Zero Knowledge"}
          href="/public/zk/login"
          icon={<FaKey className="w-5 h-5" />}
        />
        <SidebarButton
          label="View All Fund Release"
          active={active === "View All Fund Release"}
          href="/public/view-all-fund-release"
          icon={<FaKey className="w-5 h-5" />}
        />
      </nav>

      {/* Footer */}
      <div className="relative z-10 mt-auto pt-6 border-t border-slate-200 px-1 text-[11px] text-slate-500">
        <p className="leading-relaxed">
          Citizen View •{" "}
          <span className="font-medium text-slate-700">Read-only access</span>
          <br />
          <span className="text-[10px] text-slate-400">
            Data powered by government blockchain records
          </span>
        </p>
      </div>
    </aside>
  );
}

function SidebarButton({ label, active, href, icon }) {
  return (
    <a
      href={href}
      className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
        transition-all duration-200
        ${
          active
            ? "bg-slate-900 text-slate-50 shadow-md shadow-slate-900/30"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        }
      `}
    >
      {/* left active bar */}
      {active && (
        <span className="absolute -left-1 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-emerald-400 shadow shadow-emerald-500/60" />
      )}

      <span
        className={`flex items-center justify-center ${
          active
            ? "text-emerald-300"
            : "text-slate-500 group-hover:text-sky-600"
        }`}
      >
        {icon}
      </span>

      <span className="truncate">{label}</span>

      {/* Right hint */}
      <span
        className={`
          ml-auto text-[10px] uppercase tracking-wider
          transition-all duration-200
          ${
            active
              ? "text-emerald-300 opacity-100"
              : "text-slate-400 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
          }
        `}
      >
        {active ? "Active" : "View"}
      </span>
    </a>
  );
}
