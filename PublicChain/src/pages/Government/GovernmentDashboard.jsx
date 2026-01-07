import React, { useEffect, useState } from "react";
import GovernmentSidebar from "./GovernmentSidebar";
import api from "../../axios/api";

/* ---------- Blockchain Status ---------- */
function BlockchainStatus() {
  const [valid, setValid] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      setChecking(true);
      try {
        const res = await api.get("/api/blockchain/verify");
        setValid(res.data.valid);
      } catch {
        setValid(null);
      } finally {
        setChecking(false);
      }
    }
    check();
  }, []);

  return (
    <div className="mt-8 mb-4">
      <div className="inline-block px-4 py-2 rounded bg-white border border-gray-300 shadow text-sm font-medium text-gray-800">
        Blockchain Integrity:{" "}
        {checking ? (
          "Checking..."
        ) : valid === true ? (
          <span className="text-green-600 font-semibold">Valid</span>
        ) : valid === false ? (
          <span className="text-red-600 font-semibold">Invalid</span>
        ) : (
          <span className="text-gray-500">Unknown</span>
        )}
      </div>
    </div>
  );
}

/* ---------- Recent Fund Releases ---------- */
function RecentFundReleases() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    async function fetchFunds() {
      setLoading(true);
      try {
        const res = await api.get("/api/blockchain/chain");
        setFunds(res.data.chain.slice(-5).reverse());
      } catch {
        setFunds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFunds();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-[#0A3A67] mb-3">
        Recent Fund Releases
      </h3>

      {loading ? (
        <div className="text-gray-700 text-sm">Loading...</div>
      ) : funds.length === 0 ? (
        <div className="text-gray-600 text-sm">No fund releases found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm border border-gray-300 rounded bg-white text-gray-800">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="px-3 py-2 border text-left">Title</th>
                <th className="px-3 py-2 border text-left">Amount</th>
                <th className="px-3 py-2 border text-left">Department</th>
                <th className="px-3 py-2 border text-left">Timestamp</th>
                <th className="px-3 py-2 border text-left">Block Hash</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((block) => (
                <tr
                  key={block.block_hash}
                  className="hover:bg-[#f1f4f8] cursor-pointer"
                  onClick={() => setSelectedBlock(block)}
                >
                  <td className="px-3 py-2 border font-medium">
                    {block.fund_data?.title || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {block.fund_data?.amount || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {block.fund_data?.department || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {block.timestamp
                      ? new Date(Number(block.timestamp)).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2 border font-mono text-xs">
                    {block.block_hash.slice(0, 12)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-md p-6 max-w-lg w-full border border-gray-300 relative text-gray-900">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              onClick={() => setSelectedBlock(null)}
            >
              ×
            </button>

            <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center">
              Fund Block Details
            </h2>

            <div className="border border-gray-200 rounded-md p-4 bg-[#f9fafb]">
              <table className="w-full text-xs md:text-sm border-separate border-spacing-y-2 text-gray-800">
                <tbody>
                  <tr>
                    <td className="font-medium pr-3 align-top w-1/3">Title</td>
                    <td>{selectedBlock.fund_data?.title || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-3 align-top">Amount</td>
                    <td>{selectedBlock.fund_data?.amount || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-3 align-top">Department</td>
                    <td>{selectedBlock.fund_data?.department || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-3 align-top">Description</td>
                    <td>{selectedBlock.fund_data?.description || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-3 align-top">Timestamp</td>
                    <td>
                      {selectedBlock.timestamp
                        ? new Date(
                            Number(selectedBlock.timestamp)
                          ).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-3 align-top">Block Hash</td>
                    <td className="font-mono break-all">
                      {selectedBlock.block_hash}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-3 align-top">
                      Previous Hash
                    </td>
                    <td className="font-mono break-all">
                      {selectedBlock.prev_hash || "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-3 align-top">Signature</td>
                    <td className="font-mono break-all">
                      {selectedBlock.signature || "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- MAIN DASHBOARD ---------- */
export default function GovernmentDashboard() {
  const [stats, setStats] = useState({
    totalFunds: 0,
    totalProjects: 0,
    totalDepartments: 0,
    latestFund: null,
  });
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [fundRes, projectRes, deptRes] = await Promise.all([
          api.get("/api/blockchain/chain"),
          api.get("/api/projects"),
          api.get("/api/departments"),
        ]);

        setStats({
          totalFunds: fundRes.data.chain.length,
          totalProjects: projectRes.data.projects.length,
          totalDepartments: deptRes.data.departments.length,
          latestFund: fundRes.data.chain.at(-1) || null,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  async function openProfile() {
    try {
      // Get current user profile (assuming /api/profile returns government user info)
      const res = await api.get("/api/profile");
      setProfile(res.data.user || null);
      setProfileOpen(true);
    } catch {
      setProfile(null);
      setProfileOpen(true);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f5f6fa] text-gray-900 font-sans">
      <GovernmentSidebar />

      {/* FULL WIDTH DASHBOARD AREA */}
      <div className="flex-1 w-full p-10 relative">
        {/* Profile Icon Button */}
        <button
          className="absolute top-8 right-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-blue-50 focus:outline-none"
          title="View Profile"
          onClick={openProfile}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-blue-900"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              stroke="currentColor"
              strokeWidth="2"
              d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
            />
          </svg>
        </button>

        {/* Profile Modal */}
        {profileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-md p-6 max-w-lg w-full border border-gray-300 relative text-gray-900">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
                onClick={() => setProfileOpen(false)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center">
                Government Profile
              </h2>
              <div className="border border-gray-200 rounded-md p-4 bg-[#f9fafb]">
                {profile ? (
                  <table className="w-full text-xs md:text-sm border-separate border-spacing-y-2 text-gray-800">
                    <tbody>
                      <tr>
                        <td className="font-medium pr-3 align-top w-1/3">
                          Name
                        </td>
                        <td>{profile.name || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">Email</td>
                        <td>{profile.email || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">Role</td>
                        <td>{profile.role || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">Contact</td>
                        <td>{profile.contact_number || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">
                          Department
                        </td>
                        <td>{profile.department_name || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">Address</td>
                        <td>{profile.address || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-700 text-sm">
                    Profile not available.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-semibold text-[#0A3A67] mb-8">
          Government Dashboard
        </h1>

        {loading ? (
          <div className="text-gray-700">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-300 rounded-md py-6 text-center">
                <div className="text-3xl font-semibold text-[#0A3A67]">
                  {stats.totalFunds}
                </div>
                <div className="text-gray-800">Fund Releases</div>
              </div>

              <div className="bg-white border border-gray-300 rounded-md py-6 text-center">
                <div className="text-3xl font-semibold text-[#0A3A67]">
                  {stats.totalProjects}
                </div>
                <div className="text-gray-800">Projects</div>
              </div>

              <div className="bg-white border border-gray-300 rounded-md py-6 text-center">
                <div className="text-3xl font-semibold text-[#0A3A67]">
                  {stats.totalDepartments}
                </div>
                <div className="text-gray-800">Departments</div>
              </div>

              <div className="bg-white border border-gray-300 rounded-md p-4">
                <div className="font-medium text-gray-900">Latest Fund</div>
                <div className="text-sm text-gray-700 mt-1">
                  {stats.latestFund?.fund_data?.title || "-"}
                </div>
              </div>
            </div>

            <BlockchainStatus />

            <div className="flex gap-4 mt-6 mb-2">
              <a
                href="/government/fund-release"
                className="px-5 py-2 bg-[#0A3A67] text-white rounded font-semibold hover:bg-[#0c467f] transition"
              >
                Release Fund
              </a>
              <a
                href="/government/govt-blockchain"
                className="px-5 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
              >
                View Blockchain
              </a>
            </div>

            <RecentFundReleases />
          </>
        )}
      </div>
    </div>
  );
}
