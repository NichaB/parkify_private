"use client";
import React, { useState, useEffect } from "react";

const CalculateInput = ({ onReservationChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [total, setTotal] = useState("0 Hours");

  useEffect(() => {
    calculateTotal();
    onReservationChange({
      reservationDate: `${formatDateToDisplay(
        startDate
      )} - ${formatDateToDisplay(endDate)}`,
      startTime,
      endTime,
      total,
    });
  }, [startDate, endDate, startTime, endTime]);

  const formatDateToDisplay = (date) =>
    date ? date.split("-").reverse().join("/") : "";

  const calculateTotal = () => {
    if (startDate && endDate && startTime && endTime) {
      const start = new Date(`${startDate}T${startTime}:00+07:00`);
      const end = new Date(`${endDate}T${endTime}:00+07:00`);
      const diffHours = Math.floor((end - start) / (1000 * 60 * 60));
      setTotal(
        `${Math.floor(diffHours / 24)} Days ${diffHours % 24} Hours` ||
          "0 Hours"
      );
    } else setTotal("Invalid time range");
  };

  return <div>{/* Input fields for date and time selection */}</div>;
};

export default CalculateInput;
