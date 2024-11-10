"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import from next/navigation in Next.js 13+
import { supabase } from "../../../config/supabaseClient"; // Ensure this path is correct
import Link from "next/link";


const IssueDetailPage = () => {
  const { id } = useParams(); // Extract the ID using useParams
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchIssue = async () => {
        try {
          const { data, error } = await supabase
            .from("issue")
            .select("issue_id, issue_detail, status, issue_header")
            .eq("issue_id", id)
            .single();

          if (error) {
            console.error("Error fetching data:", JSON.stringify(error, null, 2));
            setError("Failed to fetch the issue. Check console for details.");
          } else {
            setIssue(data);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchIssue();
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("issue")
        .update({ status: newStatus })
        .eq("issue_id", id);

      if (error) {
        console.error("Error updating status:", JSON.stringify(error, null, 2));
        alert("Failed to update status. Check console for details.");
      } else {
        setIssue({ ...issue, status: newStatus });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred while updating status.");
    }
  };


  if (loading) {
    return <p className="text-center">Loading issue details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!issue) {
    return <p className="text-center">No issue found.</p>;
  }

  return (
    <div>
    <div className="p-8 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-md mt-10">
      <Link href="/home" className="text-gray-500 hover:text-gray-700 mb-6 inline-block">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md">&larr;</span>
      </Link>
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{issue.issue_header}</h1>
      <p className="text-sm text-gray-500 mb-4">Issue ID: {issue.issue_id}</p>
      <div className="mb-6">
        <p className="font-semibold text-lg mb-2 text-gray-800">Issue Detail:</p>
        <p className="text-gray-700 leading-relaxed">{issue.issue_detail}</p>
      </div>
      <div className="mb-6">
        <p className="font-semibold text-lg text-gray-800">Reported by:</p>
        <p className="text-gray-700 mb-4">{issue.reported_by || "Unknown"}</p>
      </div>
      

    
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-semibold mb-2">Status:</label>
        <div className='flex gap-2'>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${issue.status === 'Not Started' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleStatusChange('Not Started')}
          >
            Not Started
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${issue.status === 'In Progress' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleStatusChange('In Progress')}
          >
            In Progress
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${issue.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleStatusChange('Completed')}
          >
            Completed
          </button>
        </div>
      </div>
    </div>
     </div>
  );
};

export default IssueDetailPage;
