'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col h-screen bg-white p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="text-black text-lg mr-4">
          <img src="/back.png" alt="Back" className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Setting</h1>
      </div>

      {/* Setting Options */}
      <div className="space-y-4">
        <div
          onClick={() => handleNavigation('/editPark')}
          className="flex justify-between items-center p-4 bg-gray-100 rounded-lg cursor-pointer"
        >
          <span className="text-lg">My Parking lots</span>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
            <img src="/back.png" alt="Arrow" className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full flex justify-around items-center bg-white py-2 border-t border-gray-200">
        <button onClick={() => handleNavigation('/home')} className="text-gray-500">
          <img src="/home.png" alt="Home" className="w-6 h-6" />
        </button>
        <button onClick={() => handleNavigation('/setting')} className="text-red-500">
          <img src="/setting_selected.png" alt="Settings" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
