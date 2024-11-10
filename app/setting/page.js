'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineLogout } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

export default function SettingsPage() {
  const storedRenterId = sessionStorage.getItem("userId");
  const router = useRouter();
  console.log(storedRenterId);
  const handleLogout = () => {
    toast((t) => (
      <div>
        <p>Are you sure you want to log out?</p>
        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              sessionStorage.clear();
              router.push('/landing'); // Navigate to landing page
            }}
            className="mr-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Yes, Log Out
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className="flex flex-col h-screen bg-white p-6">
      <Toaster />
      {/* Relative container to position back button and heading */}
      <div className="relative flex-grow overflow-y-auto p-6">

        {/* Back Button */}
        <BackButton targetPage="/home_renter" />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-black text-left w-full px-2 mt-5 py-4">
          Settings
        </h1>

        {/* My Profile Section */}
        <div
          onClick={() => router.push('/editRenter')}
          className="flex justify-between items-center p-4 bg-gray-100 rounded-lg cursor-pointer shadow mt-5"
        >
          <span className="text-lg">My Profile</span>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-gray-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* My Parking Lots Section */}
        <div
          onClick={() => router.push('/editCar')}
          className="flex justify-between items-center p-4 bg-gray-100 rounded-lg cursor-pointer shadow mt-5"
        >
          <span className="text-lg">My Car</span>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-gray-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className="flex justify-end items-center mt-5 cursor-pointer"
        >
          <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition duration-200">
            <AiOutlineLogout className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
