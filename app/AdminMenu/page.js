"use client";

import React, { useEffect } from 'react';
import { FaHome, FaUser, FaParking, FaFileAlt, FaCar, FaBell, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const AdminMenu = () => {
    const router = useRouter();

    useEffect(() => {
        const adminId = sessionStorage.getItem("admin_id");
        if (!adminId) {
            toast.error("Admin ID not found");
            router.push("/AdminLogin");
            return;
        }
    }, [router]);

    // Function to navigate to the specified page
    const handleNavigate = (path) => {
        router.push(path);
    };

    // Function to handle logout
    const handleLogout = () => {
        sessionStorage.clear(); // Clear session storage
        router.push('/AdminLogin'); // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <Toaster />
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-customBlue">Welcome, Admin! Let’s drive Parkify’s growth together!</h1>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-2 gap-6 mb-16">
                {/* Renter Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/AdminRenter')}
                >
                    <FaUser className="text-4xl mb-2" />
                    <span className="font-semibold">Renter</span>
                </div>

                {/* Parking Lot Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/AdminParking')}
                >
                    <FaParking className="text-4xl mb-2" />
                    <span className="font-semibold">Parking Lot</span>
                </div>

                {/* Lessor Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/AdminLessor')}
                >
                    <FaFileAlt className="text-4xl mb-2" />
                    <span className="font-semibold">Lessor</span>
                </div>

                {/* Car Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/AdminCar')}
                >
                    <FaCar className="text-4xl mb-2" />
                    <span className="font-semibold">Car</span>
                </div>

                {/* Reservation Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/AdminReservation')}
                >
                    <FaBell className="text-4xl mb-2" />
                    <span className="font-semibold">Reservation</span>
                </div>

                {/* Issue Report Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/AdminIssue')}
                >
                    <FaExclamationTriangle className="text-4xl mb-2" />
                    <span className="font-semibold">Issue Report</span>
                </div>
            </div>

            {/* Logout Button */}
            <button 
                onClick={handleLogout} 
                className="fixed bottom-16 right-6 flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-md"
            >
                <FaSignOutAlt className="text-xl" />
                <span className="font-semibold">Logout</span>
            </button>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 w-full flex justify-around items-center bg-white border-t border-gray-300 py-3">
                <button onClick={() => handleNavigate('/')} className="text-red-500">
                    <FaHome className="text-2xl" />
                </button>
            </div>
        </div>
    );
};

export default AdminMenu;