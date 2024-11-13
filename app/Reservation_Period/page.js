"use client";
import React, { useEffect, useState } from 'react';
import PriceOption from '../components/PriceOption';
import ContactInfo from '../components/ContactInfo';
import BookingInfo from '../components/BookingInfo';
import ActionButtons from '../components/ActionButtons';
import CalculateInput from '../components/Booking_Calculate';
import BackButton from '../components/BackButton';
import supabase from '../../config/supabaseClient'; // Adjust the path as needed

const ParkingDetail = () => {
    const [parkingCode, setParkingCode] = useState(''); // For YWT001
    const [price, setPrice] = useState(''); // For 300 THB / HOURS

    useEffect(() => {
        // Fetch parking lot details from Supabase
        const fetchParkingDetails = async () => {
            const { data, error } = await supabase
                .from('parking_lot') // Replace with your actual table name
                .select('location_name, price_per_hour') // Replace with actual column names
                .eq('parking_lot_id', 1) // Adjust this condition based on your needs
                .single();

            if (error) {
                console.error('Error fetching parking details:', error);
            } else {
                setParkingCode(data.location_name); // Replace 'parking_code' with actual column name
                setPrice(`${data.price_per_hour} THB / HOURS`); // Replace 'price_per_hour' with actual column name
            }
        };

        fetchParkingDetails();
    }, []);

    return (
        <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
            <img
                src="parkinglots-image.jpg" // Replace with the actual image URL
                alt="User Profile"
                className="w-100 h-100 object-cover mb-4"
            />
            <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-500 text-white font-bold px-3 py-1 rounded-full">
                    {parkingCode || 'Loading...'}
                </span>
                <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full">
                    {price || 'Loading...'}
                </span>
            </div>
            <ContactInfo />
            <PriceOption />
            <CalculateInput />
        </div>
    );
};

export default ParkingDetail;
