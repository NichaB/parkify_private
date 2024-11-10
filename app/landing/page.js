'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  // Function to handle the Lessor button click
  const handleLessorClick = () => {
    router.push('/welcomelessor');
  };

  // Function to handle the Renter button click
  const handleRenterClick = () => {
    router.push('/welcomerentor');
  };

  const handleAdminClick = () => {
    router.push('/welcomeadmin');
  };

  // Function to handle the Renter button click
  const handleDevClick = () => {
    router.push('/welcomedev');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <img src='logo.png' alt="Parkify Logo" className="w-64 mb-6 md:w-80" /> {/* Logo size adjusts for medium screens */}

      <div className="flex flex-col sm:flex-row sm:space-x-4 w-full max-w-md"> {/* Stack on small screens, row on larger */}
        
        <button
          onClick={handleLessorClick}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200 flex-1 mb-4 sm:mb-0" // Takes equal space
        >
          <img src="lessor.png" alt="Lessor Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold">Lessor</span>
        </button>

        <button
          onClick={handleRenterClick}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200 flex-1 mb-4 sm:mb-0" // Takes equal space
        >
          <img src="renter.png" alt="Renter Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold">Renter</span>
        </button>

        <button
          onClick={handleAdminClick}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200 flex-1 mb-4 sm:mb-0" // Takes equal space
        >
          <img src="admin.png" alt="Renter Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold">Admin</span>
        </button>

        <button
          onClick={handleLessorClick}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200 flex-1  mb-10 sm:mb-0" // Takes equal space
        >
          <img src="dev.png" alt="Lessor Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold">Developer</span>
        </button>

      </div>
    </div>
  );
};

export default LandingPage;
