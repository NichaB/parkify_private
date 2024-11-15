"use client";
import React, { useEffect, useState } from "react";

const ContactInfo = () => {
  const [contact, setContact] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const parkingLotId = sessionStorage.getItem("parkingLotId");
        console.log("Parking Lot ID:", parkingLotId);
        if (!parkingLotId) {
          throw new Error("Parking lot ID is missing.");
        }

        const response = await fetch(
          `/api/LocationandPrice?id=${parkingLotId}`
        );
        console.log("API Response:", response);
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(
            errorDetails.error || "Failed to fetch contact information"
          );
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Debug fetched data
        setContact(data.lessorDetails);
      } catch (err) {
        console.error("Error fetching contact:", err);
        setError(err.message || "Failed to load contact information.");
      }
    };

    fetchContact();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <img
            src={contact?.profilePic ? contact.profilePic : "user_icon.png"} // Use fetched or default image
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop in case the default image also fails
              e.target.src = "user_icon.png"; // Fallback to default image
            }}
            alt="Contact"
            className="w-20 h-20 rounded-full object-cover shadow-md"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-black">
              {contact ? <span>{contact.name}</span> : "Loading..."}
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {contact ? contact.phone : "Loading..."}
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              {contact ? contact.email : "Loading..."}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactInfo;
