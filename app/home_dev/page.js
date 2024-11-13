"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../config/supabaseClient"; // Ensure this path is correct
import { useRouter } from "next/navigation"; // For Next.js 13+ with app directory

// Component for displaying individual issue details in a card format
const IssueCard = ({ issue }) => (
  <div className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm border border-gray-300 flex items-center">
    <div className="mr-4 text-center">
      <p className="text-gray-500 text-sm mb-1">Issue ID: {issue.issue_id}</p>
      <img src="/images/exclamation.png" alt="Exclamation" className="w-8 h-8" />
    </div>
    <div className="flex-1 text-center">
      <h2 className="text-lg font-bold mb-1">{issue.issue_header}</h2>
      <p className="text-gray-600">Reported by: {issue.reported_by || "Unknown"}</p>
    </div>
    <div className="flex flex-col items-end">
      <Link href={`/issue_dev/${issue.issue_id}`} className="text-black hover:text-blue-600">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200">
          <img src="/images/zoom.png" alt="Search" className="w-5 h-5" />
        </span>
      </Link>
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

const IssueReportPage = () => {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // Call the stored procedure get_all_issues using supabase.rpc
        const { data, error } = await supabase.rpc("get_all_issues");

        // Check if there was an error
        if (error) {
          console.error("Error fetching data:", error.message || error);
          setError("Failed to fetch issues. Check console for details.");
        } else {
          console.log("Fetched data:", data); // Log data to confirm structure
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

  // Function to handle user logout
  const handleLogout = () => {
    router.push("/start");
  };

  // Filter issues based on search term
  const filteredIssues = searchTerm
    ? issues.filter(issue =>
        issue.issue_header.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : issues;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Issue Report</h1>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
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
      {loading ? (
        <p className="text-center">Loading issues...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : filteredIssues.length === 0 ? (
        <p className="text-center">No issues found.</p>
      ) : (
        filteredIssues.map(issue => <IssueCard key={issue.issue_id} issue={issue} />)
      )}
      <div className="mt-auto pt-4">
        <button
          className="fixed bottom-10 right-10 w-30 mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default IssueReportPage;
