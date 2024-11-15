"use client";
import React, { useState } from "react";

const ActionButtons = ({
  reservationData,
  parkingDetails,
  onPaymentSuccess,
}) => {
  const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);

  const handleConfirmClick = async () => {
    // Send reservation data to backend and handle the response
    try {
      const response = await fetch("/api/insertReservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reservationData, ...parkingDetails }),
      });

      if (!response.ok) throw new Error("Failed to create reservation.");

      onPaymentSuccess();
    } catch (error) {
      console.error("Error confirming reservation:", error);
    }
  };

  return <div>{/* Buttons and modals for payment and confirmation */}</div>;
};

export default ActionButtons;
