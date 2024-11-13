// src/pages/AdminStart.js
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const AdminStart = () => {
    const router = useRouter();

    // Function to handle Start button click and navigate to AdminMenu
    const handleStartClick = () => {
        router.push('/AdminLogin'); // Replace with the correct path to AdminMenu
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
                <img
                    src="Parkify_Admin_Logo.png"
                    alt="Parkify Logo"
                    className="w-50 h-50 object-contain mb-4"
                />
            </div>

            {/* Start Button */}
            <button
                onClick={handleStartClick}
                className="bg-gray-800 text-white text-lg font-semibold py-3 px-16 rounded-md"
            >
                Start
            </button>
        </div>
    );
};

export default AdminStart;
