// src/pages/AdminStart.js
import React from 'react';

const AdminStart = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
                {/* Replace "logo.png" with the path to your actual logo image */}
                <img
                    src="Parkify_Admin_Logo.png"
                    alt="Parkify Logo"
                    className="w-50 h-50 object-contain mb-4"
                />
            </div>

            {/* Start Button */}
            <button className="bg-gray-800 text-white text-lg font-semibold py-3 px-16 rounded-md">
                Start
            </button>
        </div>
    );
};

export default AdminStart;
