// src/components/ConfirmationModal.js

import React from 'react';

const ConfirmationModal = ({ location, date, time, contact, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-bold mb-2">Confirm Reservation</h2>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Contact:</strong> {contact}</p>
                <p className="text-gray-500 text-sm mt-4">
                    Please note that this information will be shared with the parking lot owner.
                </p>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded-lg">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
