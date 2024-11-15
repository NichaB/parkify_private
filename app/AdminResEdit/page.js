"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

// Function to convert to Thai time (Asia/Bangkok)
const formatToThaiDatetime = (datetime) => {
  const date = new Date(datetime);
  const options = { timeZone: "Asia/Bangkok", hour12: false };
  const thaiDate = date.toLocaleString("sv-SE", options); // "sv-SE" gives `YYYY-MM-DDTHH:MM` format
  return thaiDate.replace(" ", "T");
};

const EditReservation = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    reservation_id: "",
    parking_lot_id: "",
    user_id: "",
    start_datetime: "",
    end_datetime: "",
    total_price: "",
    duration_hour: 0,
    duration_day: 0,
    car_id: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reservationId = sessionStorage.getItem("reservation_id");
    if (!reservationId) {
      toast.error("Reservation ID not found");
      router.push("/AdminReservation");
      return;
    }

    const fetchReservationData = async () => {
      try {
        console.log(`Fetching data for reservationId: ${reservationId}`);
        const response = await fetch(`/api/adFetchRes?reservationId=${reservationId}`);
        
        if (!response.ok) {
          console.error("Response Error:", await response.json());
          throw new Error("Failed to fetch reservation data");
        }
        
        const { reservationDetails } = await response.json();
        console.log("Fetched Data:", reservationDetails); // Log fetched data
        
        // Extract the first item in the array if reservationDetails is an array
        const reservation = Array.isArray(reservationDetails) ? reservationDetails[0] : reservationDetails;
        
        if (!reservation) {
          throw new Error("No reservation data found");
        }
        
        // Populate formData with fetched data
        setFormData({
          reservation_id: reservation.reservation_id || "",
          parking_lot_id: reservation.parking_lot_id || "",
          user_id: reservation.user_id || "",
          start_datetime: reservation.start_time ? formatToThaiDatetime(reservation.start_time) : "",
          end_datetime: reservation.end_time ? formatToThaiDatetime(reservation.end_time) : "",
          total_price: reservation.total_price || "",
          duration_hour: reservation.duration_hour || 0,
          duration_day: reservation.duration_day || 0,
          car_id: reservation.car_id || ""
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservation data:", error);
        toast.error("Failed to fetch reservation data.");
        router.push("/AdminReservation");
      }
    };

    fetchReservationData();
  }, [router]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`/api/adFetchRes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservation_id: formData.reservation_id,
          start_time: formData.start_datetime,
          end_time: formData.end_datetime,
          total_price: formData.total_price,
          duration_hour: formData.duration_hour,
          duration_day: formData.duration_day
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update reservation");
      }

      toast.success("Reservation information updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation information.");
    }
  };

  const handleDeleteClick = () => {
    const toastId = toast(
      <div>
        <p>Are you sure you want to delete this reservation?</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => confirmDelete(true, toastId)}
            className="bg-red-500 text-white px-3 py-1 rounded mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
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
      try {
        const response = await fetch(`/api/adFetchRes?reservationId=${formData.reservation_id}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          throw new Error("Failed to delete reservation");
        }

        toast.success("Reservation deleted successfully");
        router.push("/AdminReservation");
      } catch (error) {
        console.error("Error deleting reservation:", error);
        toast.error("Failed to delete reservation.");
      }
    }
    toast.dismiss(toastId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    calculateDuration();
  }, [formData.start_datetime, formData.end_datetime]);

  const calculateDuration = () => {
    const { start_datetime, end_datetime } = formData;
    if (start_datetime && end_datetime) {
      const start = new Date(start_datetime);
      const end = new Date(end_datetime);

      if (end > start) {
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        setFormData((prevData) => ({
          ...prevData,
          duration_hour: diffHours,
          duration_day: diffDays,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          duration_hour: 0,
          duration_day: 0,
        }));
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <Toaster />
      <button
        onClick={() => router.push("/AdminReservation")}
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

      <div className="flex justify-between mb-4 mt-20">
        <button onClick={handleDeleteClick} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        {isEditing ? (
          <button onClick={handleSaveClick} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
        ) : (
          <button onClick={handleEditClick} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Start Date & Time (Thai Time)</label>
        <input
          type="datetime-local"
          name="start_datetime"
          value={formData.start_datetime}
          onChange={handleChange}
          readOnly={!isEditing}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-500 mb-1">End Date & Time (Thai Time)</label>
        <input
          type="datetime-local"
          name="end_datetime"
          value={formData.end_datetime}
          onChange={handleChange}
          readOnly={!isEditing}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Total Price</label>
        <input
          type="number"
          name="total_price"
          value={formData.total_price}
          onChange={handleChange}
          readOnly={!isEditing}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Duration (Hours)</label>
        <input
          type="text"
          value={formData.duration_hour}
          readOnly
          className="w-full p-2 rounded border border-gray-300 bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-500 mb-1">Duration (Days)</label>
        <input
          type="text"
          value={formData.duration_day}
          readOnly
          className="w-full p-2 rounded border border-gray-300 bg-gray-100"
        />
      </div>
    </div>
  );
};

export default EditReservation;
