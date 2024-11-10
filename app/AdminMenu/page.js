// src/components/AdminDashboard.jsx
"use client";

import React from 'react';
import { FaHome, FaUser, FaParking, FaFileAlt, FaCar, FaBell, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

const AdminDashboard = () => {


    return (
        <div className="min-h-screen bg-white p-6">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-8">Welcome Admin01</h1>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Renter Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('AdminRenter')}
                >
                    <FaUser className="text-4xl mb-2" />
                    <span className="font-semibold">Renter</span>
                </div>

                {/* Parking Lot Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/parking-lot')}
                >
                    <FaParking className="text-4xl mb-2" />
                    <span className="font-semibold">Parking Lot</span>
                </div>

                {/* Lessor Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/lessor')}
                >
                    <FaFileAlt className="text-4xl mb-2" />
                    <span className="font-semibold">Lessor</span>
                </div>

                {/* Car Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/car')}
                >
                    <FaCar className="text-4xl mb-2" />
                    <span className="font-semibold">Car</span>
                </div>

                {/* Reservation Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/reservation')}
                >
                    <FaBell className="text-4xl mb-2" />
                    <span className="font-semibold">Reservation</span>
                </div>

                {/* Issue Report Card */}
                <div
                    className="bg-gray-100 p-6 rounded-lg flex flex-col items-center cursor-pointer"
                    onClick={() => handleNavigate('/issue-report')}
                >
                    <FaExclamationTriangle className="text-4xl mb-2" />
                    <span className="font-semibold">Issue Report</span>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 w-full flex justify-around items-center bg-white border-t border-gray-300 py-3">
                <button className="text-red-500">
                    <FaHome className="text-2xl" />
                </button>
                <button className="text-gray-500">
                    <FaUser className="text-2xl" />
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
