'use client';
import React, { useState } from 'react';
import RegisterButton from '../components/RegisterButton';  // Importing the RegisterButtonBlack component
import { InputField } from '../components/InputField';  // Importing the InputField component
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginButton from '../components/LoginButton';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const router = useRouter(); // To handle back navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form Data:', formData);
  };

  return (
    <div className="relative flex flex-col justify-between h-screen bg-white">
      {/* Back Button (Fixed at the top left corner) */}
      <button 
        onClick={() => router.push('/welcome')} 
        className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
      >
        {/* Arrow Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-10">
        Welcome back! <br /> Glad to see you, Again!
      </h1>

      {/* Login Form */}
      <div className="flex-grow flex flex-col items-center w-full max-w-md p-6 bg-white rounded-md">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="flex flex-col items-center space-y-4">
            <InputField 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              className="w-4/5"
            />
            <InputField 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              value={formData.password}
              onChange={handleChange}
              className="w-4/5"
            />
          </div>
        </form>
      </div>

      {/* Submit Button and Login Redirect at the bottom */}
      <div className="w-full max-w-md p-6 bg-white rounded-md text-center pb-20">
        <LoginButton onCick = {handleSubmit}></LoginButton>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-400">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
