"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PaymentSuccess = ({ reservationData, parkingDetails, onClose }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-black text-white rounded-lg w-100 p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          X
        </button>
        <h2>Reservation Successful!</h2>
        <p>Total Payment: THB {reservationData.totalPrice.toFixed(2)}</p>
        <p>Location: {parkingDetails.location}</p>
        <p>
          Date & Time: {reservationData.reservationDate}{" "}
          {reservationData.startTime} - {reservationData.endTime}
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
