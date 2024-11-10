
import React from 'react';
import PriceOption from '../components/PriceOption';
import ContactInfo from '../components/ContactInfo';
import BookingInfo from '../components/BookingInfo';
import ActionButtons from '../components/ActionButtons';
import CalculateInput from '../components/Booking_Calculate';
import BackButton from '../components/BackButton';

const ParkingDetail = () => {
    return (
        <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
            <img
                src="parkinglots-image.jpg" // Replace with the actual image URL
                alt="User Profile"
                className="w-100 h-100 object-cover mb-4"
            />
            <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-500 text-white font-bold px-3 py-1 rounded-full">YWT001</span>
                <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full">300 THB / DAY</span>
            </div>
            <ContactInfo />
            <PriceOption />
            <CalculateInput />


        </div>
    );
};

export default ParkingDetail;
