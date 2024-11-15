'use client';
import React, { useEffect, useState } from 'react';
import ContactInfo from '../components/ContactInfo';
import ReservationSection from '../components/ReservationSection';

const ParkingDetail = () => {
    const [parkingDetails, setParkingDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParkingDetails = async () => {
            try {
                const parkingLotId = sessionStorage.getItem('parkingLotId');
                if (!parkingLotId) {
                    throw new Error('Parking lot ID is missing in session storage.');
                }

                const response = await fetch(`/api/LocationandPrice?id=${parkingLotId}`);
                if (!response.ok) {
                    const errorDetails = await response.json();
                    throw new Error(errorDetails.error || 'Failed to fetch parking details.');
                }

                const data = await response.json();
                console.log('Fetched Parking Details:', data);
                setParkingDetails(data);
            } catch (err) {
                console.error('Error fetching parking details:', err);
                setError(err.message || 'Failed to load parking details.');
            }
        };

        fetchParkingDetails();
    }, []);

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (!parkingDetails) {
        return <p className="text-gray-500 text-center">Loading...</p>;
    }

    return (
        <div className="w-full h-full bg-gray-100 flex flex-col items-center py-8">
            <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-lg p-6 lg:p-12">
                <img
                    src="parkinglots-image.jpg"
                    alt="Parking Lot"
                    className="w-full h-96 object-cover rounded-lg mb-6"
                />
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-6">
                    <span className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full text-base lg:text-xl">
                        {parkingDetails.parkingCode}
                    </span>
                    <span className="bg-green-500 text-white font-bold px-4 py-2 rounded-full text-base lg:text-xl">
                        {parkingDetails.price}
                    </span>
                </div>
                <ContactInfo />
                <ReservationSection parkingDetails={parkingDetails} />
            </div>
        </div>
    );
};

export default ParkingDetail;
