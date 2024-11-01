// app/page.js
'use client';
import React from 'react';
import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const WelcomePage = () => {
  const router = useRouter();

  // Function to handle the Register button click
  const handleRegisterClick = () => {
    router.push('/register');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src='logo.png' alt="Parkify Logo" className="w-64 mb-6" />

      {/* Options Section */}
      <div className="flex space-x-8">
        {/* Lessor Card */}
        <Link href="/welcome">
          <div className="flex flex-col items-center justify-center w-40 h-40 bg-gray-100 rounded-lg shadow-lg hover:shadow-gray-400 hover:bg-gray-300 transition duration-200 cursor-pointer">
            <Image
              src="/parking-area.png" // Replace with your lessor icon path
              alt="Lessor Icon"
              width={100}
              height={100}
            />
            <p className="mt-2 text-black font-semibold">Lessor</p>
          </div>
        </Link>

        {/* Renter Card */}
        <Link href="/welcome">
          <div className="flex flex-col items-center justify-center w-40 h-40 bg-gray-100 rounded-lg shadow-lg hover:shadow-gray-400 hover:bg-gray-300 transition duration-200 cursor-pointer">
            <Image
              src="/booking.png" // Replace with your renter icon path
              alt="Renter Icon"
              width={100}
              height={100}
            />
            <p className="mt-2 text-black font-semibold">Renter</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
