// src/components/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../config/supabaseClient';

const PaymentSuccess = ({ reservationDate, startTime, endTime, totalPrice }) => {
    const router = useRouter();
    const [bookerName, setBookerName] = useState('Loading...');
    const [location, setLocation] = useState('Loading...');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: userInfoData, error: userInfoError } = await supabase
                    .from('user_info')
                    .select('first_name, last_name')
                    .eq('user_id', 27)
                    .single();

                if (userInfoError) {
                    console.error('Error fetching booker name:', userInfoError);
                } else {
                    setBookerName(`${userInfoData.first_name} ${userInfoData.last_name}`);
                }

                const { data: parkingData, error: parkingError } = await supabase
                    .from('parking_lot')
                    .select('location_name')
                    .eq('parking_lot_id', 1)
                    .single();

                if (parkingError) {
                    console.error('Error fetching parking location:', parkingError);
                } else {
                    setLocation(parkingData.location_name);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleClose = () => {
        router.push('/Home');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-black text-white rounded-lg w-100 p-6 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-lg"
                >
                    X
                </button>
                <h2 className="text-2xl font-bold text-center mb-1">Reserved Success!</h2>
                <p className="text-gray-400 text-center mb-4">Your payment has been successfully done.</p>

                <div className="flex justify-between items-center bg-gray-800 py-4 px-6 rounded-lg mb-6">
                    <p className="text-gray-400 text-lg">Total Payment</p>
                    <p className="text-2xl font-bold">THB {totalPrice.toFixed(2)}</p>
                    <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center ml-2">
                        <span>✔</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <p className="text-gray-400 font-semibold">Location</p>
                        <p className="font-semibold">{location}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-400 font-semibold">Date & Time Reservation</p>
                        <div className="text-right pl-5">
                            <p><span className='text-white'>{reservationDate}</span></p>
                            <p><span className='text-white'>{startTime} - {endTime}</span></p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-400 font-semibold">Booker Name</p>
                        <p>{bookerName}</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
