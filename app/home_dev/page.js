"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient"; // Ensure this path is correct
import { useRouter } from "next/navigation"; // For Next.js 13+ with app directory
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast

const IssueCard = ({ issue }) => {
  const router = useRouter();

  // Function to handle the click event and navigate without displaying the ID in the URL
  const handleIssueClick = () => {
    // Store the issue_id in session storage
    sessionStorage.setItem("issue_id", issue.issue_id);

    // Navigate to the next page
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
  const [developerId, setDeveloperId] = useState(null);

  useEffect(() => {
    // Retrieve developer_id from session storage
    const id = sessionStorage.getItem("developer_id");
    if (id) {
      setDeveloperId(id);
    } else {
      // Redirect to login if developer_id is not found
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
          setError("Failed to fetch issues. Check console for details.");
        } else {
          console.log("Fetched data:", data);
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

  const filteredIssues = searchTerm
    ? issues.filter(issue =>
        issue.issue_header.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : issues;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 mt-10">Issue Report</h1>

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
        filteredIssues.map(issue => (
          <IssueCard key={issue.issue_id} issue={issue} />
        ))
      )}
      {/* ToastContainer is not needed in React Hot Toast */}
    </div>
  );
};

export default IssueReportPage;
