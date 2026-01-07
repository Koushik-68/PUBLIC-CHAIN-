import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/RegisterFixed";
import DepartmentDashboard from "./pages/Department/Dashboard";
import AddProject from "./pages/Department/AddProject";
import RiseFundRequest from "./pages/Department/RiseFundRequest";
import DepartmentProjects from "./pages/Department/DepartmentProjects";
import PublicView from "./pages/public/PublicView";
import ViewAllProjects from "./pages/public/ViewAllProjects";
import ViewAllFundRequests from "./pages/Department/ViewAllFundRequests";
import TrackByLocationDept from "./pages/public/TrackByLocationDept";
import SubmitFeedback from "./pages/public/SubmitFeedback";
import ViewAllFundRelease from "./pages/public/ViewAllFundRelease";
import VerifiedUsers from "./pages/Admin/VerifiedUsers";
import AllProjects from "./pages/Admin/AllProjects";
import FundRequests from "./pages/Admin/FundRequests";
import Feedback from "./pages/Admin/Feedback";
import PendingRegistrations from "./pages/Admin/PendingRegistrations";
import BlockchainExplorer from "./pages/public/BlockchainExplorer";
import GovtBlockChainExplorer from "./pages/Government/GovtBlockChainExplorer";
import GovernmentDashboard from "./pages/Government/GovernmentDashboard";
import FundRelease from "./pages/Government/FundRelease";
import GovernmentProjects from "./pages/Government/GovernmentProjects";
import GovernmentFundRequests from "./pages/Government/GovernmentFundRequests";

// ✅ Zero Knowledge pages (correct path)
import ZKLogin from "./pages/public/ZeroKnowledge/ZKLogin";
import DigiLockerHome from "./pages/public/ZeroKnowledge/DigiLockerHome";
import GenerateProof from "./pages/public/ZeroKnowledge/GenerateProof";
import VerifyProof from "./pages/public/ZeroKnowledge/VerifyProof";

import "./index.css";
import Admin from "./pages/Admin/Admin";

function App() {
  const buttonStyle =
    "px-4 py-2 font-semibold rounded-lg transition-all duration-300 ease-in-out transform shadow-lg hover:scale-105 active:scale-95";

  return (
    <BrowserRouter>
      {/* Full screen wrapper so sidebar can sit at left edge */}
      <div className="min-h-screen w-full bg-[#0D051B] text-white flex flex-col">
        {/* Top centered header buttons */}
        <header className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-4">
              <Link
                to="/public"
                className={`${buttonStyle} bg-gray-700/50 text-indigo-200 border border-gray-600 hover:bg-gray-700/80 shadow-gray-700/30`}
              >
                View
              </Link>
              <Link
                to="/login"
                className={`${buttonStyle} bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/40 hover:from-blue-400 hover:to-indigo-500`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`${buttonStyle} bg-indigo-700/50 text-indigo-300 border border-indigo-600 hover:bg-indigo-700/80 shadow-indigo-700/30`}
              >
                Register
              </Link>
            </div>
          </div>
        </header>

        {/* Main content area: full width. Sidebar at left, router content fills rest */}
        <div className="flex-1 flex w-full">
          <Routes>
            {/* Public routes */}
            <Route path="/public" element={<PublicView />} />
            <Route
              path="/public/view-all-projects"
              element={<ViewAllProjects />}
            />
            <Route
              path="/public/track-by-location-dept"
              element={<TrackByLocationDept />}
            />
            <Route
              path="/public/submit-feedback"
              element={<SubmitFeedback />}
            />

            {/* ✅ Zero Knowledge DigiLocker routes */}
            <Route path="/public/zk/login" element={<ZKLogin />} />
            <Route path="/public/zk/home" element={<DigiLockerHome />} />
            <Route path="/public/zk/generate" element={<GenerateProof />} />
            <Route path="/public/zk/verify" element={<VerifyProof />} />
            <Route
              path="/public/view-all-fund-release"
              element={<ViewAllFundRelease />}
            />

            {/* Auth & Admin */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/verified-users" element={<VerifiedUsers />} />
            <Route path="/admin/all-projects" element={<AllProjects />} />
            <Route path="/admin/fund-requests" element={<FundRequests />} />
            <Route path="/admin/feedback" element={<Feedback />} />
            <Route
              path="/admin/pending-registrations"
              element={<PendingRegistrations />}
            />

            {/* Blockchain public explorer */}
            {/* Example only – depends on your router setup */}
            <Route
              path="/public/blockchain-explorer"
              element={<BlockchainExplorer />}
            />
            <Route
              path="/public/project-blockchain"
              element={<BlockchainExplorer />}
            />

            {/* Department */}
            <Route path="/dashboard" element={<DepartmentDashboard />} />
            <Route path="/department/add-project" element={<AddProject />} />
            <Route
              path="/department/projects"
              element={<DepartmentProjects />}
            />
            <Route
              path="/department/rise-fund-request"
              element={<RiseFundRequest />}
            />
            <Route
              path="/department/view-all-fund-requests"
              element={<ViewAllFundRequests />}
            />

            {/* Government */}
            <Route
              path="/government/dashboard"
              element={<GovernmentDashboard />}
            />
            <Route path="/government/fund-release" element={<FundRelease />} />
            <Route
              path="/government/government-projects"
              element={<GovernmentProjects />}
            />
            <Route
              path="/government/govt-blockchain"
              element={<GovtBlockChainExplorer />}
            />
            <Route
              path="/government/fund-requests"
              element={<GovernmentFundRequests />}
            />

            {/* Default */}
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
