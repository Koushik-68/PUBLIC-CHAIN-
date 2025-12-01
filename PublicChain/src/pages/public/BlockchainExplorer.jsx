// src/pages/public/BlockchainExplorer.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "../../axios/api";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaLink,
  FaUnlink,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaClock,
  FaBuilding,
  FaPhone,
  FaInfoCircle,
  FaKey,
  FaCube,
  FaCubes,
} from "react-icons/fa";

export default function BlockchainExplorer() {
  const [activeTab, setActiveTab] = useState("fund"); // "fund" | "project"

  // -------------------- Common helpers --------------------
  const formatDateTime = (value) => {
    if (!value) return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return new Date(num).toLocaleString();
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined) return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString("en-IN");
  };

  // -------------------- FUND BLOCKCHAIN STATE --------------------
  const [fundChain, setFundChain] = useState([]);
  const [fundValid, setFundValid] = useState(true);
  const [fundLoading, setFundLoading] = useState(true);
  const [fundLoadingVerify, setFundLoadingVerify] = useState(true);
  const [fundError, setFundError] = useState(null);
  const [fundSelectedBlock, setFundSelectedBlock] = useState(null);
  const [fundShowModal, setFundShowModal] = useState(false);

  // -------------------- PROJECT BLOCKCHAIN STATE --------------------
  const [projectChain, setProjectChain] = useState([]);
  const [projectValid, setProjectValid] = useState(true);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectLoadingVerify, setProjectLoadingVerify] = useState(true);
  const [projectError, setProjectError] = useState(null);
  const [projectSelectedBlock, setProjectSelectedBlock] = useState(null);
  const [projectShowModal, setProjectShowModal] = useState(false);

  // -------------------- FUND: fetch chain + verify --------------------
  useEffect(() => {
    async function fetchFundChain() {
      try {
        setFundLoading(true);
        setFundError(null);
        const res = await axios.get("/api/blockchain/chain");
        const rows = res.data.chain || [];

        const normalized = rows.map((block) => {
          let fundData = block.fund_data;
          if (typeof fundData === "string") {
            try {
              fundData = JSON.parse(fundData);
            } catch (e) {}
          }
          return { ...block, fund_data: fundData };
        });

        setFundChain(normalized);
      } catch (err) {
        console.error(err);
        setFundError("Failed to load fund blockchain data.");
        setFundChain([]);
      } finally {
        setFundLoading(false);
      }
    }

    async function fetchFundVerify() {
      try {
        setFundLoadingVerify(true);
        const res = await axios.get("/api/blockchain/verify");
        setFundValid(!!res.data.valid);
      } catch (err) {
        console.error(err);
        setFundValid(false);
      } finally {
        setFundLoadingVerify(false);
      }
    }

    fetchFundChain();
    fetchFundVerify();
  }, []);

  // -------------------- PROJECT: fetch chain + verify --------------------
  useEffect(() => {
    async function fetchProjectChain() {
      try {
        setProjectLoading(true);
        setProjectError(null);
        const res = await axios.get("/api/blockchain/project/chain");
        const rows = res.data.chain || [];

        const normalized = rows.map((block) => {
          let projectData = block.project_data;
          if (typeof projectData === "string") {
            try {
              projectData = JSON.parse(projectData);
            } catch (e) {}
          }
          return { ...block, project_data: projectData };
        });

        setProjectChain(normalized);
      } catch (err) {
        console.error(err);
        setProjectError("Failed to load project blockchain data.");
        setProjectChain([]);
      } finally {
        setProjectLoading(false);
      }
    }

    async function fetchProjectVerify() {
      try {
        setProjectLoadingVerify(true);
        const res = await axios.get("/api/blockchain/project/verify");
        setProjectValid(!!res.data.valid);
      } catch (err) {
        console.error(err);
        setProjectValid(false);
      } finally {
        setProjectLoadingVerify(false);
      }
    }

    fetchProjectChain();
    fetchProjectVerify();
  }, []);

  // ------------- Derived modal values -------------
  const fundSelectedData = fundSelectedBlock?.fund_data || {};
  const fundSelectedIndex = fundSelectedBlock
    ? fundChain.findIndex((b) => b.id === fundSelectedBlock.id)
    : -1;

  const projectSelectedData = projectSelectedBlock?.project_data || {};
  const projectSelectedIndex = projectSelectedBlock
    ? projectChain.findIndex((b) => b.id === projectSelectedBlock.id)
    : -1;

  // ----------- FUND UI helpers -----------
  const fundStatusColor = fundValid
    ? "from-emerald-500 to-sky-500"
    : "from-red-500 to-rose-500";

  const fundStatusIcon = fundValid ? (
    <FaCheckCircle className="w-7 h-7 text-emerald-600" />
  ) : (
    <FaExclamationTriangle className="w-7 h-7 text-rose-600" />
  );

  const fundStatusText = fundValid
    ? "Fund Blockchain Verified"
    : "Fund Blockchain Broken / Tampered";

  const fundStatusDesc = fundValid
    ? "All fund release records are consistent and cryptographically secured."
    : "Some fund blocks do not match their original hashes. Data may have been changed.";

  const fundNodeIcon = fundValid ? (
    <FaLink className="w-3.5 h-3.5 text-emerald-600" />
  ) : (
    <FaUnlink className="w-3.5 h-3.5 text-rose-600" />
  );

  // ----------- PROJECT UI helpers -----------
  const projectStatusColor = projectValid
    ? "from-emerald-500 to-indigo-500"
    : "from-red-500 to-rose-500";

  const projectStatusIcon = projectValid ? (
    <FaCheckCircle className="w-6 h-6 text-emerald-600" />
  ) : (
    <FaExclamationTriangle className="w-6 h-6 text-rose-600" />
  );

  const projectStatusText = projectValid
    ? "Project Blockchain Verified"
    : "Project Blockchain Broken / Tampered";

  const projectStatusDesc = projectValid
    ? "All project records are consistent and linked correctly."
    : "Some project blocks do not match their original hashes. Data may have been changed.";

  const projectNodeIcon = projectValid ? (
    <FaLink className="w-3.5 h-3.5 text-emerald-700" />
  ) : (
    <FaUnlink className="w-3.5 h-3.5 text-rose-700" />
  );

  // =========================================================
  // MAIN RETURN
  // =========================================================
  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 font-sans">
      <Sidebar active="Blockchain Explorer" />

      <main className="flex-1 px-4 md:px-8 lg:px-10 py-8 lg:py-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* HEADER + TAB BUTTONS */}
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 flex items-center gap-3">
                <span className="p-3 rounded-xl bg-white shadow border border-slate-200">
                  <FaCubes className="text-indigo-600 w-6 h-6" />
                </span>
                Blockchain Explorer
              </h1>
              <p className="text-sm md:text-base text-slate-600 mt-2 max-w-2xl">
                View government fund releases and department projects stored on
                separate blockchains. Breaking one chain will not affect the
                other.
              </p>
            </div>

            {/* TAB SWITCHER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("fund")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === "fund"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FaMoneyBillWave className="w-4 h-4" />
                Fund Blockchain
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("project")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === "project"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FaProjectDiagram className="w-4 h-4" />
                Project Blockchain
              </button>
            </div>
          </header>

          {/* SMALL INFO BOX */}
          <section className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-700 shadow-sm flex items-start gap-2">
            <FaInfoCircle className="mt-0.5 text-indigo-500 w-4 h-4" />
            <p>
              The <span className="font-semibold">Fund Blockchain</span> stores
              government fund releases. The{" "}
              <span className="font-semibold">Project Blockchain</span> stores
              department project records. They are{" "}
              <span className="font-semibold">independent</span> – verification
              and data of one chain will not affect the other.
            </p>
          </section>

          {/* ==================== FUND BLOCKCHAIN VIEW ==================== */}
          {activeTab === "fund" && (
            <>
              {/* Global Status */}
              <section className="relative overflow-hidden rounded-3xl shadow-md border border-gray-200 bg-white">
                <div
                  className={`w-full h-2 bg-gradient-to-r ${fundStatusColor}`}
                />

                <div className="p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{fundStatusIcon}</div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {fundStatusText}
                        {fundLoadingVerify && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-600">
                            Checking...
                          </span>
                        )}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 mt-1">
                        {fundStatusDesc}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                          <span className="w-3 h-3 rounded-full bg-emerald-400" />
                          Valid chain of blocks
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                          <span className="w-3 h-3 rounded-full bg-rose-400" />
                          Broken / tampered chain
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm flex flex-col gap-2 min-w-[230px] border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-2 text-gray-800">
                        <FaLink className="w-4 h-4 text-indigo-500" />
                        Total Blocks
                      </span>
                      <span className="font-bold text-xl text-gray-900">
                        {fundLoading ? "..." : fundChain.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <FaInfoCircle className="w-3 h-3 text-gray-500" />
                      <span>
                        Editing any old block changes its hash and breaks the
                        chain link shown below.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Error */}
              {fundError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm shadow-sm">
                  {fundError}
                </div>
              )}

              {/* Chain view */}
              <section>
                <h2 className="text-2xl font-bold text-[#16213E] mb-4 flex items-center gap-2">
                  <FaMoneyBillWave className="text-indigo-500 w-6 h-6" />
                  Fund Blockchain Chain
                </h2>

                {fundLoading ? (
                  <div className="text-center text-gray-600 py-10 font-medium">
                    Loading fund blocks...
                  </div>
                ) : fundChain.length === 0 ? (
                  <div className="text-center text-gray-600 py-10 font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                    No fund blocks found yet. Once government releases funds,
                    each transaction will appear here as a chained block.
                  </div>
                ) : (
                  <div className="w-full flex flex-row gap-6">
                    {/* legend (desktop) */}
                    <div className="hidden md:flex flex-col gap-3 pt-2 min-w-[160px] text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span>Valid chain link</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-400" />
                        <span>Broken / tampered chain</span>
                      </div>
                    </div>

                    {/* Chain blocks */}
                    <div className="relative flex-1">
                      {/* Vertical chain line */}
                      <div
                        className={`absolute left-5 top-0 bottom-0 ${
                          fundValid
                            ? "border-l-4 border-emerald-400"
                            : "border-l-4 border-rose-400 border-dashed"
                        }`}
                      />

                      <div className="space-y-6">
                        {fundChain.map((block, index) => {
                          const fund = block.fund_data || {};
                          const isFirst = index === 0;
                          const isLast = index === fundChain.length - 1;

                          return (
                            <div
                              key={block.id || index}
                              className="relative pl-10 cursor-pointer"
                              onClick={() => {
                                setFundSelectedBlock(block);
                                setFundShowModal(true);
                              }}
                            >
                              {/* Chain node circle */}
                              <div
                                className={`absolute left-3 top-7 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                                  fundValid
                                    ? "bg-emerald-50 border border-emerald-400"
                                    : "bg-rose-50 border border-rose-400"
                                }`}
                              >
                                {fundNodeIcon}
                              </div>

                              {/* Block card */}
                              <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-5 md:p-6">
                                {/* Block header row */}
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-indigo-500 font-semibold">
                                      <FaCube className="w-3 h-3" />
                                      Block #{index + 1}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                                      <FaBuilding className="w-4 h-4 text-indigo-400" />
                                      {fund.department || "Unknown Department"}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-[#16213E] flex flex-wrap items-center gap-2">
                                      {fund.title || "Untitled Fund Release"}
                                      {isFirst && (
                                        <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                          Genesis Block
                                        </span>
                                      )}
                                      {isLast && fundChain.length > 1 && (
                                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                          Latest Block
                                        </span>
                                      )}
                                    </h3>
                                    {fund.reason && (
                                      <p className="text-xs md:text-sm text-gray-600">
                                        {fund.reason}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex flex-col items-end gap-1 text-right">
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                      <FaClock className="w-4 h-4" />
                                      <span>
                                        {formatDateTime(block.timestamp)}
                                      </span>
                                    </div>
                                    <div
                                      className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                                        fund.urgency === "High"
                                          ? "bg-red-50 text-red-600 border border-red-200"
                                          : fund.urgency === "Normal"
                                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                          : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                                      }`}
                                    >
                                      Urgency: {fund.urgency || "Not specified"}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
                                      <FaMoneyBillWave className="w-4 h-4" />₹
                                      {formatAmount(fund.amount)}
                                    </div>
                                  </div>
                                </div>

                                {/* Extra Info row */}
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] md:text-xs">
                                  <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-100">
                                    <div className="font-semibold text-indigo-700 mb-1">
                                      Contact
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <FaPhone className="w-4 h-4 text-indigo-400" />
                                      <span>
                                        {fund.contact || "Not provided"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
                                    <div className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
                                      <FaKey className="w-4 h-4 text-blue-400" />
                                      Block Hash
                                    </div>
                                    <div className="text-[10px] break-all text-gray-700">
                                      {block.block_hash}
                                    </div>
                                  </div>

                                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200">
                                    <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                      <FaLink className="w-4 h-4 text-gray-400" />
                                      Previous Hash
                                    </div>
                                    <div className="text-[10px] break-all text-gray-700">
                                      {block.prev_hash ||
                                        "None (Genesis Block)"}
                                    </div>
                                  </div>
                                </div>

                                {/* Signature row */}
                                <div className="mt-3 bg-slate-50 rounded-2xl p-3 border border-slate-200 text-[10px] md:text-[11px] text-gray-700">
                                  <span className="font-semibold text-gray-900">
                                    Signature:
                                  </span>{" "}
                                  {block.signature}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* FUND MODAL */}
              {fundShowModal && fundSelectedBlock && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                  onClick={() => setFundShowModal(false)}
                >
                  <div
                    className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          Fund Block Details
                        </h3>
                        <p className="text-xs text-gray-500">
                          Click outside or on × to close
                        </p>
                      </div>
                      <button
                        className="text-gray-500 hover:text-gray-800 text-2xl leading-none px-2"
                        onClick={() => setFundShowModal(false)}
                      >
                        &times;
                      </button>
                    </div>

                    <div className="p-4 overflow-auto max-h-[60vh]">
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700 w-40">
                              Block Number
                            </td>
                            <td className="py-2 text-gray-800">
                              {fundSelectedIndex >= 0
                                ? fundSelectedIndex + 1
                                : "-"}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Department
                            </td>
                            <td className="py-2 text-gray-800">
                              {fundSelectedData.department ||
                                "Unknown Department"}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Title
                            </td>
                            <td className="py-2 text-gray-800">
                              {fundSelectedData.title ||
                                "Untitled Fund Release"}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Reason
                            </td>
                            <td className="py-2 text-gray-800">
                              {fundSelectedData.reason || "Not provided"}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Urgency
                            </td>
                            <td className="py-2 text-gray-800">
                              {fundSelectedData.urgency || "Not specified"}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Amount
                            </td>
                            <td className="py-2 text-gray-800">
                              ₹{formatAmount(fundSelectedData.amount)}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Contact
                            </td>
                            <td className="py-2 text-gray-800">
                              {fundSelectedData.contact || "Not provided"}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Timestamp
                            </td>
                            <td className="py-2 text-gray-800">
                              {formatDateTime(fundSelectedBlock.timestamp)}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Block Hash
                            </td>
                            <td className="py-2 text-gray-800 break-all">
                              {fundSelectedBlock.block_hash}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Previous Hash
                            </td>
                            <td className="py-2 text-gray-800 break-all">
                              {fundSelectedBlock.prev_hash ||
                                "None (Genesis Block)"}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold py-2 pr-4 text-gray-700">
                              Signature
                            </td>
                            <td className="py-2 text-gray-800 break-all">
                              {fundSelectedBlock.signature}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==================== PROJECT BLOCKCHAIN VIEW ==================== */}
          {activeTab === "project" && (
            <>
              {/* Global Status */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="w-full h-1.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-emerald-500 to-sky-500" />
                <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{projectStatusIcon}</div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                        {projectStatusText}
                        {projectLoadingVerify && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                            Checking…
                          </span>
                        )}
                      </h2>
                      <p className="text-sm text-slate-600 mt-1">
                        {projectStatusDesc}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          Valid chain
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          Broken / tampered link
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm flex flex-col gap-2 min-w-[230px] border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-2 text-slate-800">
                        <FaLink className="w-4 h-4 text-indigo-600" />
                        Total Blocks
                      </span>
                      <span className="font-bold text-xl text-slate-900">
                        {projectLoading ? "…" : projectChain.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <FaInfoCircle className="w-3 h-3 text-slate-500" />
                      <span>
                        Any manual change in a past record will change its hash
                        and break the link.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Error */}
              {projectError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 text-sm shadow-sm">
                  {projectError}
                </div>
              )}

              {/* Chain section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                    <FaProjectDiagram className="text-indigo-600 w-5 h-5" />
                    Project Blockchain Chain
                  </h2>
                  <div className="hidden md:flex gap-4 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>Valid chain link</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span>Broken / tampered chain</span>
                    </div>
                  </div>
                </div>

                {projectLoading ? (
                  <div className="text-center text-slate-600 py-10 text-sm">
                    Loading project blocks…
                  </div>
                ) : projectChain.length === 0 ? (
                  <div className="text-center text-slate-600 py-10 text-sm bg-white rounded-xl border border-dashed border-slate-300">
                    No project blocks found yet. Once projects are added, each
                    transaction will be recorded and shown here.
                  </div>
                ) : (
                  <div className="relative pl-8">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />

                    <div className="space-y-6">
                      {projectChain.map((block, index) => {
                        const project = block.project_data || {};
                        const isFirst = index === 0;
                        const isLast = index === projectChain.length - 1;

                        return (
                          <button
                            key={block.id || index}
                            type="button"
                            className="relative flex items-start gap-4 w-full text-left focus:outline-none"
                            onClick={() => {
                              setProjectSelectedBlock(block);
                              setProjectShowModal(true);
                            }}
                          >
                            {/* Node circle */}
                            <div
                              className={`mt-5 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                                projectValid
                                  ? "bg-emerald-50 border border-emerald-400"
                                  : "bg-rose-50 border border-rose-400"
                              }`}
                            >
                              {projectNodeIcon}
                            </div>

                            {/* Block card */}
                            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
                              {/* Top row */}
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-indigo-600 font-semibold">
                                    <FaCube className="w-3 h-3" />
                                    Block #{index + 1}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                                    <FaBuilding className="w-4 h-4 text-indigo-400" />
                                    {project.department_id ||
                                      "Unknown Department"}
                                  </div>
                                  <h3 className="text-lg font-semibold text-slate-900 flex flex-wrap items-center gap-2">
                                    {project.project_name || "Untitled Project"}
                                    {isFirst && (
                                      <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                        Genesis Block
                                      </span>
                                    )}
                                    {isLast && projectChain.length > 1 && (
                                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Latest Block
                                      </span>
                                    )}
                                  </h3>
                                  {project.description && (
                                    <p className="text-xs text-slate-600">
                                      {project.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1 text-right">
                                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                    <FaClock className="w-4 h-4" />
                                    <span>
                                      {formatDateTime(block.timestamp)}
                                    </span>
                                  </div>
                                  {project.contact && (
                                    <div className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
                                      <FaPhone className="w-4 h-4" />
                                      {project.contact}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Extra info row */}
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] md:text-xs">
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                  <div className="font-semibold text-slate-800 mb-1">
                                    Budget
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-700">
                                    <span>₹{formatAmount(project.budget)}</span>
                                  </div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                  <div className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                                    <FaKey className="w-4 h-4 text-slate-500" />
                                    Block Hash
                                  </div>
                                  <div className="text-[10px] break-all text-slate-700">
                                    {block.block_hash}
                                  </div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                  <div className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                                    <FaLink className="w-4 h-4 text-slate-500" />
                                    Previous Hash
                                  </div>
                                  <div className="text-[10px] break-all text-slate-700">
                                    {block.prev_hash || "None (Genesis Block)"}
                                  </div>
                                </div>
                              </div>

                              {/* Signature */}
                              <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-200 text-[10px] md:text-[11px] text-slate-700">
                                <span className="font-semibold text-slate-900">
                                  Signature:
                                </span>{" "}
                                {block.signature}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* PROJECT MODAL */}
              {projectShowModal && projectSelectedBlock && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                  onClick={() => setProjectShowModal(false)}
                >
                  <div
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden text-slate-900"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Project Block Details
                        </h3>
                        <p className="text-xs text-slate-500">
                          Click outside or on × to close
                        </p>
                      </div>
                      <button
                        className="text-slate-500 hover:text-slate-800 text-2xl leading-none px-2"
                        onClick={() => setProjectShowModal(false)}
                      >
                        &times;
                      </button>
                    </div>

                    <div className="p-4 overflow-auto max-h-[60vh] text-sm">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 w-40 text-slate-700">
                              Block Number
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedIndex >= 0
                                ? projectSelectedIndex + 1
                                : "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Department
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.department_id ||
                                "Unknown Department"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Project Name
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.project_name ||
                                "Untitled Project"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Type
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.type || "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Location
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.location || "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Budget
                            </td>
                            <td className="py-2 text-slate-800">
                              ₹{formatAmount(projectSelectedData.budget)}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Officer
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.officer || "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Contact
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.contact || "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Start Date
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.start_date || "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              End Date
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.end_date || "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Status
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.status || "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Blockchain Verified
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.blockchain_verify === 1
                                ? "Yes"
                                : "No"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Description
                            </td>
                            <td className="py-2 text-slate-800">
                              {projectSelectedData.description || "-"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Timestamp
                            </td>
                            <td className="py-2 text-slate-800">
                              {formatDateTime(projectSelectedBlock.timestamp)}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Block Hash
                            </td>
                            <td className="py-2 text-slate-800 break-all">
                              {projectSelectedBlock.block_hash}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Previous Hash
                            </td>
                            <td className="py-2 text-slate-800 break-all">
                              {projectSelectedBlock.prev_hash ||
                                "None (Genesis Block)"}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold py-2 pr-4 text-slate-700">
                              Signature
                            </td>
                            <td className="py-2 text-slate-800 break-all">
                              {projectSelectedBlock.signature}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
