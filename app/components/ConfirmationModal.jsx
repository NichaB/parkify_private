// src/components/ConfirmationModal.js
import React from 'react';
import supabase from '../../config/supabaseClient';

const ConfirmationModal = ({ location, date, time, contact, onClose, userId, parkingLotId, carId }) => {
    const handleConfirm = async () => {
        // Assuming time is in "8.00 AM - 10.00 AM" format, split it
        const [startTime, endTime] = time.split(" - ");
        const totalHours = 2; // Example duration (calculate based on start and end time if necessary)
        const totalPrice = totalHours * 100; // Example calculation for total price, adjust as necessary

        const { data, error } = await supabase
            .from('reservation')
            .insert([
                {
                    parking_lot_id: parkingLotId,
                    user_id: userId,
                    reservation_date: date,
                    start_time: startTime,
                    end_time: endTime,
                    total_price: totalPrice,
                    duration_hour: totalHours,
                    duration_day: 0, // Adjust as necessary
                    car_id: carId,
                },
            ]);

        if (error) {
            console.error("Error inserting reservation:", error.message);
        } else {
            console.log("Reservation successfully added:", data);
            onClose(); // Close the modal after confirming
            // Optionally, redirect to the home page or show a success message
        }
    };

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
                    <button
                        onClick={handleConfirm}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
