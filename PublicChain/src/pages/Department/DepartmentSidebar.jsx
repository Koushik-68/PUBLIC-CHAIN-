import {
  IoHomeOutline,
  IoCashOutline,
  IoPeopleOutline,
  IoChatbubbleEllipsesOutline,
  IoLogOutOutline,
  IoConstructOutline,
  IoPulseOutline,
  IoDocumentTextOutline,
  IoWalletOutline,
  IoReceiptOutline, // <-- Added new icon here
} from "react-icons/io5";
import { useNavigate } from "react-router-dom"; // ✅ added

// Define the primary navigation items
const navItems = [
  { href: "/dashboard", icon: IoHomeOutline, label: "Home" },
  {
    href: "/department/add-project",
    icon: IoConstructOutline, // Using IoHammerOutline for projects/work
    label: "Add/Manage Projects",
  },
  {
    href: "/department/projects",
    icon: IoDocumentTextOutline, // Using IoStatsChartOutline for fund requests/metrics
    label: "View All Projects",
  },
  {
    href: "/department/rise-fund-request",
    icon: IoCashOutline, // Using IoStatsChartOutline for fund requests/metrics
    label: "Raise Fund Request",
  },

  {
    href: "/department/view-all-fund-requests",
    icon: IoReceiptOutline,
    label: "All Fund Requests",
  },
  // {
  //   href: "/department/analytics",
  //   icon: IoPulseOutline,
  //   label: "Performance Metrics",
  // },
];

export default function DepartmentSidebar() {
  const navigate = useNavigate(); // ✅ added

  // Base class for navigation links
  const linkBaseClasses =
    "flex items-center gap-4 px-4 py-3 rounded-xl transition duration-200 ease-in-out font-medium";

  // Class for the rich, stylish hover/active state
  const linkHoverClasses =
    "text-white bg-blue-600/20 hover:bg-blue-600/40 border border-transparent hover:border-blue-500/50 transform hover:scale-[1.02]";

  // ✅ same logout logic like DepartmentDashboard
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <aside className="w-72 bg-gray-900 border-r border-blue-900 min-h-screen flex flex-col shadow-2xl shadow-blue-900/50">
      {/* Header Section */}
      <div className="pt-10 pb-8 px-6 border-b border-blue-900/50">
        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 tracking-wider">
          Public-Chain
        </div>
        <div className="text-sm text-gray-500 mt-1">Department Dashboard</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-6">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${linkBaseClasses} ${linkHoverClasses} text-blue-300`}
          >
            <item.icon className="text-2xl text-cyan-400" />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-blue-900/50">
        <button
          onClick={handleLogout} // ✅ added
          className={`${linkBaseClasses} w-full justify-start text-red-400 hover:bg-red-900/40 border border-transparent hover:border-red-500/50 font-bold`}
        >
          <IoLogOutOutline className="text-2xl" />
          Logout
        </button>
      </div>
    </aside>
  );
}
