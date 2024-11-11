'use client';
import React from 'react';
import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import { useRouter } from 'next/navigation';  // Import the useRouter hook


const WelcomePage = () => {
  const router = useRouter();  // Initialize the router

  // Function to handle the Register button click
  const handleRegisterClick = () => {
    router.push('/register_renter');  // Navigate to the register page
  };
  
  const handleLoginClick = () => {
    router.push('/login_renter');  // Navigate to the register page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src='logo.png' alt="Parkify Logo" className="w-64 mb-6" />

      <LoginButton onClick={handleLoginClick}/>
      {/* Pass the handleRegisterClick function to the RegisterButton */}
      <RegisterButton variant="white" onClick={handleRegisterClick} />

    </div>
  );
};

export default WelcomePage;
