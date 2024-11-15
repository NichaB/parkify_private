"use client";
import React, { useState } from "react";
import CalculateInput from "./CalculateInput";
import ActionButtons from "./ActionButtons";
import PaymentSuccess from "./PaymentSuccess";

const ReservationSection = ({ parkingDetails }) => {
  const [reservationData, setReservationData] = useState({
    reservationDate: "",
    startTime: "",
    endTime: "",
    total: "0 Hours",
  });
  const [isPaymentSuccessVisible, setIsPaymentSuccessVisible] = useState(false);

  const handleReservationChange = (newData) => {
    setReservationData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <CalculateInput onReservationChange={handleReservationChange} />
      <ActionButtons
        reservationData={reservationData}
        parkingDetails={parkingDetails}
        onPaymentSuccess={() => setIsPaymentSuccessVisible(true)}
      />
      {isPaymentSuccessVisible && (
        <PaymentSuccess
          reservationData={reservationData}
          parkingDetails={parkingDetails}
          onClose={() => setIsPaymentSuccessVisible(false)}
        />
      )}
    </div>
  );
};

export default ReservationSection;
