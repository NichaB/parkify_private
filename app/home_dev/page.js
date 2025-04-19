"use client";

import React, { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaSignOutAlt,
} from "react-icons/fa"; // Import icons
import { useRouter } from "next/navigation"; // For Next.js 13+ with app directory
import { toast } from "react-hot-toast";
import supabase from "../../config/supabaseClient";

const IssueCard = ({ issue }) => {
  const router = useRouter();

  const handleIssueClick = () => {
    sessionStorage.setItem("issue_id", issue.issue_id);
    router.push("/issue_dev");
  };

  return (
    <div
      className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm border border-gray-300 flex items-center cursor-pointer"
      onClick={handleIssueClick}
    >
      <div className="mr-4 text-center">
        <p className="text-gray-500 text-sm mb-1">Issue ID: {issue.issue_id}</p>
        <img src="/images/exclamation.png" alt="Exclamation" className="w-8 h-8" />
      </div>
      <div className="flex-1 text-center">
        <h2 className="text-lg font-bold mb-1">{issue.issue_header}</h2>
        <p className="text-gray-600">Reported by: {issue.reported_by || "Unknown"}</p>
      </div>
      <div className="flex flex-col items-end">
        <p
          className={`font-semibold mb-2 ${
            issue.status === "Not Started"
              ? "text-red-500"
              : issue.status === "In Progress"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          Status: {issue.status}
        </p>
      </div>
    </div>
  );
};

const IssueReportPage = () => {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const developerId = sessionStorage.getItem("developer_id");
    if (!developerId) {
      toast.error("Please log in to access issues.");
      router.push("/login_dev");
    }
  }, [router]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data, error } = await supabase.rpc("get_all_issues");
        if (error) {
          console.error("Error fetching data:", error.message || error);
          setError("Failed to fetch issues.");
        } else {
          setIssues(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const statusPriority = {
    "Not Started": 0,
    "In Progress": 1,
    "Completed": 2,
  };

  const filteredIssues = (searchTerm
    ? issues.filter((issue) =>
        issue.issue_header.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : issues
  ).sort((a, b) => {
    return statusPriority[a.status] - statusPriority[b.status];
  });

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login_dev");
  };

  return (
    <div className="relative p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 mt-10">Issue Report</h1>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-2 text-gray-500 hover:text-black"
          >
            ×
          </button>
        )}
      </div>

      <div>
        {loading ? (
          <p className="text-center">Loading issues...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredIssues.length === 0 ? (
          <p className="text-center">No issues found.</p>
        ) : (
          filteredIssues.map((issue) => <IssueCard key={issue.issue_id} issue={issue} />)
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed top-10 right-5 flex items-center bg-red-500 text-white px-4 py-2 rounded-full shadow-lg space-x-2 hover:bg-red-600"
      >
        <FaSignOutAlt className="text-xl" />
        <span className="font-semibold">Logout</span>
      </button>
    </div>
  );
};

export default IssueReportPage;
