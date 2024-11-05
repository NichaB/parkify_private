'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

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
        <button
          onClick={() => router.push('/home')}
          className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-4">
          Settings
        </h1>

        {/* My Parking Lots Bar */}
        <div
          onClick={() => handleNavigation('/editPark')}
          className="flex justify-between items-center p-4 bg-gray-100 rounded-lg cursor-pointer mb-8 mx-6"
        >
          <span className="text-lg">My Parking lots</span>
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
