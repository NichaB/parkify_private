"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../config/supabaseClient";
import toast, { Toaster } from 'react-hot-toast';

const EditIssue = () => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    issue_id: "",
    admin_id: "",
    issue_header: "",
    issue_detail: "",
    status: "Not Started",
    resolved_by: ""
  });
  const [loading, setLoading] = useState(true);

  // Fetch issue data
  useEffect(() => {
    const issueId = sessionStorage.getItem("issue_id");
    if (!issueId) {
      toast.error("Issue ID not found");
      router.push("/AdminIssue");
      return;
    }

    const fetchIssueData = async () => {
      const { data, error } = await supabase
        .from("issue")
        .select("*")
        .eq("issue_id", issueId)
        .single();

      if (error) {
        console.error("Error fetching issue data:", error);
        toast.error("Failed to fetch issue data.");
        router.push("/AdminIssue");
      } else {
        setFormData({
          issue_id: data.issue_id,
          admin_id: data.admin_id,
          issue_header: data.issue_header,
          issue_detail: data.issue_detail,
          status: data.status || "Not Started",
          resolved_by: data.resolved_by || ""
        });
        setLoading(false);
      }
    };

    fetchIssueData();
  }, [router]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    if ((formData.status === "In Progress" || formData.status === "Done") && !formData.resolved_by) {
      toast.error("Resolved By field cannot be empty for In Progress or Done status.");
      return;
    }

    try {
      const { error } = await supabase
        .from("issue")
        .update({
          admin_id: formData.admin_id,
          issue_header: formData.issue_header,
          issue_detail: formData.issue_detail,
          status: formData.status,
          resolved_by: formData.resolved_by || null
        })
        .eq("issue_id", formData.issue_id);

      if (error) {
        console.error("Error updating issue data:", error);
        toast.error("Failed to update issue information.");
      } else {
        toast.success("Issue information updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving data");
    }
  };

  const handleDeleteClick = () => {
    const toastId = toast(
      <div>
        <p>Are you sure you want to delete this issue?</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => confirmDelete(true, toastId)}
            className="bg-red-500 text-white px-3 py-1 rounded mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)} // Dismiss the specific toast
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const confirmDelete = async (isConfirmed, toastId) => {
    if (isConfirmed) {
      const { error } = await supabase
        .from("issue")
        .delete()
        .eq("issue_id", formData.issue_id);

      if (error) {
        console.error("Error deleting issue:", error);
        toast.error("Failed to delete issue.");
      } else {
        toast.success("Issue deleted successfully");
        router.push("/AdminIssue");
      }
    }
    toast.dismiss(toastId); // Dismiss the confirmation toast after handling "Yes" or "No"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <Toaster />
      <button
        onClick={() => router.push("/AdminIssue")}
        className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>


      <div className="flex justify-between mb-4 mt-24">
        <Toaster position="top-center" />
        <button onClick={handleDeleteClick} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        {isEditing ? (
          <button onClick={handleSaveClick} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        ) : (
          <button onClick={handleEditClick} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
        )}
      </div>

      {/* Issue Details */}
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Issue ID</label>
        <input
          type="text"
          name="issue_id"
          value={formData.issue_id}
          readOnly
          className="w-full p-2 rounded border border-gray-300 bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Admin ID</label>
        <input
          type="text"
          name="admin_id"
          value={formData.admin_id}
          readOnly
          className="w-full p-2 rounded border border-gray-300 bg-gray-100"
          />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Issue Header</label>
        <input
          type="text"
          name="issue_header"
          value={formData.issue_header}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${isEditing ? 'border-blue-400' : 'border-gray-300'}`}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Issue Detail</label>
        <textarea
          name="issue_detail"
          value={formData.issue_detail}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${isEditing ? 'border-blue-400' : 'border-gray-300'}`}
          rows={4}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={!isEditing}
          className={`w-full p-2 rounded border ${isEditing ? 'border-blue-400' : 'border-gray-300'}`}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Resolved By</label>
        <input
          type="text"
          name="resolved_by"
          value={formData.resolved_by}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${isEditing ? 'border-blue-400' : 'border-gray-300'}`}
        />
      </div>
    </div>
  );
};

export default EditIssue;
