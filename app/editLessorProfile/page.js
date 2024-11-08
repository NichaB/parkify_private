"use client";
import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import BackButton from "../components/BackButton";
import FileUpload from "../../config/fileUpload";

export default function EditLessor() {
  const lessorId = "9"; // Define lessorId at the top level for access across functions
  const [lessorDetails, setLessorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const fileUploadRef = useRef(null); // Ref for FileUpload component

  const fieldLabels = {
    lessor_firstname: "First Name",
    lessor_lastname: "Last Name",
    lessor_phone_number: "Phone Number",
    lessor_line_url: "LINE URL",
  };

  useEffect(() => {
    const fetchLessorDetails = async () => {
      try {
        const response = await fetch(`../api/fetchLessor?lessorId=${lessorId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Error fetching data");

        setLessorDetails(data.lessorDetails || {});
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error fetching lessor details");
      } finally {
        setLoading(false);
      }
    };

    fetchLessorDetails();
  }, [lessorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessorDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const lessorId = lessorDetails.lessor_id || '9'; // Defaulting to '9' or retrieve from lessorDetails if set
    const imageUrl = 'path/to/image'; // Replace with actual image URL handling logic

    if (!lessorId) {
      toast.error('Lessor ID is required');
      return;
    }

    try {
      const response = await fetch(`../api/fetchLessor`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lessorDetails, lessor_image: imageUrl, lessor_id: lessorId }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Update failed');
      toast.success('Lessor details updated successfully');
    } catch (error) {
      toast.error('Error saving data');
      console.error('Save error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`../api/fetchLessor?lessorId=${lessorId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Delete failed");

      toast.success("Account deleted successfully!");
      // Redirect or update the UI after deletion
    } catch (error) {
      toast.error("Error deleting account");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = () => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this account?</p>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDelete();
              }}
              className="mr-2 bg-red-500 text-white px-4 py-2 rounded"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
      }
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      {/* Header section with BackButton */}
      <div className="relative flex-grow overflow-y-auto p-6">
        <BackButton targetPage="/setting" />
        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-5 py-4">
          Profile Setting
        </h1>
        <div className="flex flex-col items-center mt-20 ">
          <img
            src={lessorDetails.lessor_image || "profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-5"
          />

          {/* Editable fields for lessor details */}
          {Object.keys(fieldLabels).map((field) => (
            <div
              key={field}
              className="flex items-center justify-between mb-4 w-full max-w-sm bg-gray-100 p-4 rounded-lg shadow-lg"
            >
              <label className="text-sm text-gray-400 w-1/3">
                {fieldLabels[field]}
              </label>
              <input
                type="text"
                name={field}
                value={lessorDetails[field] || ""}
                onChange={handleChange}
                className="text-gray-800 text-right w-2/3 focus:outline-none bg-transparent"
              />
              <FaEdit className="ml-2 text-gray-400" />
            </div>
          ))}

          {/* Profile Image upload with FileUpload component */}
          <FileUpload
            ref={fileUploadRef}
            storageBucket="lessor_image"
            oldImagePath={lessorDetails.lessor_image}
          />

          {/* Save and Delete buttons */}
          <div className="flex justify-between w-full max-w-sm mt-5 space-x-4">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 mb-10"
            >
              SAVE
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 mb-10"
            >
              DELETE ACCOUNT
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
