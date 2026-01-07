import React, { useEffect, useState } from "react";
import api from "../../axios/api";
import Sidebar from "../../components/Sidebar";

export default function ViewAllFundRelease() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFunds() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/blockchain/chain");
        if (res.data.success && Array.isArray(res.data.chain)) {
          setFunds(res.data.chain.reverse());
        } else {
          setError("Failed to fetch fund releases.");
        }
      } catch (err) {
        setError("Error fetching fund releases.");
      } finally {
        setLoading(false);
      }
    }
    fetchFunds();
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-slate-100 text-slate-900">
      <Sidebar active="View All Fund Release" />

      <main className="flex-1 p-8 bg-slate-100">
        {/* Page Title */}
        <div className="mb-6 border-b border-slate-300 pb-3">
          <h1 className="text-2xl font-semibold text-slate-900">
            All Fund Releases
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete list of all government fund releases recorded on the
            blockchain.
          </p>
        </div>

        {loading && (
          <div className="text-slate-700 font-medium">
            Loading fund releases...
          </div>
        )}

        {error && (
          <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white border border-slate-300 rounded-md shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-200 text-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Block Hash
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {funds.map((block, idx) => {
                  let data = block.fund_data;
                  if (typeof data === "string") {
                    try {
                      data = JSON.parse(data);
                    } catch {}
                  }

                  return (
                    <tr
                      key={block.id || idx}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {funds.length - idx}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {data?.title || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        ₹{data?.amount?.toLocaleString() || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {data?.department || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {data?.description || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {block.timestamp
                          ? new Date(Number(block.timestamp)).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 break-all">
                        {block.block_hash?.slice(0, 12)}...
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {funds.length === 0 && (
              <div className="text-slate-500 text-center py-6">
                No fund releases found.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
