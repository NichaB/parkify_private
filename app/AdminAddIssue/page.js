"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../config/supabaseClient";
import { toast, Toaster } from "react-hot-toast";
import { FaExclamationCircle } from "react-icons/fa"; // Import the issue icon

const AddIssuePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    issue_header: "",
    issue_detail: "",
    status: "Not Started",
  });
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const storedAdminId = sessionStorage.getItem("admin_id");
    if (storedAdminId) {
      setAdminId(storedAdminId);
    } else {
      toast.error("Admin ID not found. Please log in.");
      router.push("/Adminlogin"); // Redirect to login if admin_id is missing
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) {
      toast.error("Admin ID is required to add an issue.");
      return;
    }

    const { error } = await supabase.from("issue").insert({
      ...formData,
      admin_id: adminId,
    });

    if (error) {
      console.error("Error adding issue:", error);
      toast.error("Failed to add issue.");
    } else {
      toast.success("Issue added successfully.");
      router.push("/AdminIssue");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Toaster position="top-center" />

      {/* Large Icon at the Top */}
      <div className="flex justify-center items-center text-red-600 mb-6">
        <FaExclamationCircle className="text-6xl" />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">Add New Issue</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Issue Header</label>
          <input
            type="text"
            name="issue_header"
            value={formData.issue_header}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Issue Detail</label>
          <textarea
            name="issue_detail"
            value={formData.issue_detail}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status</label>
          <input
            type="text"
            name="status"
            value="Not Started"
            readOnly
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-red-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Issue
        </button>
      </form>
    </div>
  );
};

export default AddIssuePage;
