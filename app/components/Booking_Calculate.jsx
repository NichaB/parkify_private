// src/components/Booking_Calculate.jsx
"use client";

import React, { useState, useEffect } from 'react';
import ActionButtons from './ActionButtons';

function ReservationComponent() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [total, setTotal] = useState('0 Hours');

    const allInputsFilled = startDate && endDate && startTime && endTime;

    useEffect(() => {
        calculateTotal();
    }, [startDate, endDate, startTime, endTime]);

    const calculateTotal = () => {
        if (startDate && endDate && startTime && endTime) {
            const start = new Date(`${startDate}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);

            if (end > start) {
                const diffMs = end - start;
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffHours / 24);
                const remainingHours = diffHours % 24;

                let totalText = '';
                if (diffDays > 0) totalText += `${diffDays} Day${diffDays > 1 ? 's' : ''} `;
                if (remainingHours > 0) totalText += `${remainingHours} Hour${remainingHours > 1 ? 's' : ''}`;
                setTotal(totalText || '0 Hours');
            } else {
                setTotal('Invalid time range');
            }
        } else {
            setTotal('0 Hours');
        }
    };

    return (
        <div className="p-4">
            <div className="flex mb-4 space-x-4">
                <div>
                    <label className="text-gray-500 text-sm">DATE</label>
                    <div className="flex space-x-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 rounded-md border border-gray-300"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 rounded-md border border-gray-300"
                        />
                    </div>
                </div>
            </div>
            <div className="flex mb-4 space-x-4">
                <div>
                    <label className="text-gray-500 text-sm">TIME</label>
                    <div className="flex space-x-2">
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2 rounded-md border border-gray-300"
                        />
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 rounded-md border border-gray-300"
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <span className="text-gray-600 font-semibold text-lg">TOTAL</span>
                <span className="text-gray-900 font-bold text-lg">{total}</span>
            </div>

            {/* Pass date, time, and total to ActionButtons */}
            <ActionButtons
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime}
            />
        </div>
    );
}

export default ReservationComponent;
