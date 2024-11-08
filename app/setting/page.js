'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

export default function SettingsPage() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col h-screen bg-white p-6">
      {/* Relative container to position back button and heading */}
      <div className="relative flex-grow overflow-y-auto p-6">

        {/* Back Button */}
        <BackButton targetPage="/home_lessor" />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-black text-left w-full px-2 mt-5 py-4">
          Settings
        </h1>

        {/* My Parking Lots Bar */}
        <div
          onClick={() => handleNavigation('/editLessorProfile')}
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
          onClick={() => handleNavigation('/editPark')}
          className="flex justify-between items-center p-4 bg-gray-100 rounded-lg cursor-pointer shadow mt-5"
        >
          <span className="text-lg">My Parking Lots</span>
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
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
