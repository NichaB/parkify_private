// src/components/ActionButtons.jsx
"use client";

import React, { useState } from 'react';
import PaymentSuccess from './PaymentSuccess';

const ActionButtons = ({ startDate, endDate, startTime, endTime }) => {
    const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);
    const [isPaymentSuccessVisible, setIsPaymentSuccessVisible] = useState(false); // New state for PaymentSuccess


    // Check if all input fields are filled
    const allInputsFilled = startDate && endDate && startTime && endTime;

    // Function to open the popup
    const handlePaymentClick = () => {
        if (allInputsFilled) {
            setIsConfirmPopupVisible(true);
        }
    };

    // Function to close the popup
    const closePopup = () => {
        setIsConfirmPopupVisible(false);
    };

    // Function to handle confirm button click
    const handleConfirmClick = () => {
        setIsConfirmPopupVisible(false);
        setIsPaymentSuccessVisible(true); // Show PaymentSuccess component
    };

    return (
        <div className="flex justify-around mt-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center">
                <img src="google-maps.png" alt="Google Maps" className="bg-white rounded-full p-1 w-5 h-5 mr-2" />
                Directions
            </button>
            <button
                onClick={handlePaymentClick}
                disabled={!allInputsFilled}
                className={`py-2 px-4 rounded-lg ${allInputsFilled ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'
                    } text-white`}
            >
                Payment
            </button>

            {/* Confirmation Popup */}
            {isConfirmPopupVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                        <h2 className="text-xl font-bold mb-2 text-black">Confirm Reservation</h2>
                        <p><span className="font-semibold text-black">Location:</span> <span className='text-black'>Yaowarat</span></p>
                        <p><span className="font-semibold text-black">Date:</span> <span className='text-black'>{startDate} - {endDate}</span></p>
                        <p><span className="font-semibold text-black">Time:</span> <span className='text-black'>{startTime} - {endTime}</span></p>
                        <p><span className="font-semibold text-black">Contact:</span> <span className='text-black'>+66 89 123 4567</span></p>
                        <p className="text-gray-500 text-sm mt-2">Please note that this information will be shared with the parking lot owner.</p>

                        <div className="flex justify-between mt-4">
                            <button onClick={closePopup} className="bg-red-500 text-white py-2 px-4 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleConfirmClick} className="bg-green-500 text-white py-2 px-4 rounded-lg">
                                Confirm
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* Payment Success Popup */}
            {isPaymentSuccessVisible && <PaymentSuccess onClose={() => setIsPaymentSuccessVisible(false)}
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime} />} {/* Display PaymentSuccess component when confirmed */}
        </div>
    );
};

export default ActionButtons;
