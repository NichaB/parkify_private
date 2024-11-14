"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../config/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
      router.push("/"); // Redirect if user_id is missing
      return;
    }

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("user_info")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        router.push("/");
      } else {
        setFormData({
          userId: data.user_id,
          firstName: data.first_name,
          lastName: data.last_name,
          phoneNumber: data.phone_number,
          username: data.username,
          email: data.email,
          password: data.password,
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    const { error } = await supabase
      .from("user_info")
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
      })
      .eq("user_id", formData.userId);

    if (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user information.");
    } else {
      toast.success("User information updated successfully");
      setIsEditing(false);
    }
  };

  const handleDeleteClick = () => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => confirmDelete(true)}
            className="bg-red-500 text-white px-3 py-1 rounded mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => confirmDelete(false)}
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
        toastId: "delete-confirm-toast",
      }
    );
  };

  const confirmDelete = async (isConfirmed) => {
    if (isConfirmed) {
      const { error } = await supabase
        .from("user_info")
        .delete()
        .eq("user_id", formData.userId);

      if (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      } else {
        toast.success("User deleted successfully");
        router.push("/AdminRenter");
      }
    } else {
      toast.dismiss("delete-confirm-toast");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push("/AdminRenter")}
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex justify-between mb-4 mt-16">
        <button
          onClick={handleDeleteClick}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
        {isEditing ? (
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">User ID</label>
        <input
          type="text"
          name="userId"
          value={formData.userId}
          readOnly
          className="w-full p-2 rounded border border-gray-300 bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${
            isEditing ? "border-blue-400" : "border-gray-300"
          }`}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${
            isEditing ? "border-blue-400" : "border-gray-300"
          }`}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full p-2 rounded border ${
            isEditing ? "border-blue-400" : "border-gray-300"
          }`}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          readOnly
          className="w-full p-2 rounded border border-gray-300 bg-gray-100"
        />
      </div>
      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default EditUser;
