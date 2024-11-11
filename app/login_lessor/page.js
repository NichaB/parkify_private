'use client';
import React, { useState, useEffect } from 'react'; 
import { InputField } from '../components/InputField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginButton from '../components/LoginButton';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('/api/checkLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Login failed');
      } else {
        sessionStorage.setItem('lessorId', result.lessor_id); // Store lessor_id for future use
        toast.success('Login successful!');
        router.push('/home_lessor'); // Redirect to the desired page on successful login
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />

      {/* Back Button */}
      <button 
        onClick={() => router.push('/welcomelessor')} 
        className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-10">
        Welcome back! <br /> Glad to see you, Again!
      </h1>

      {/* Login Form */}
      <div className="flex-grow flex flex-col items-center w-full px-6">
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center w-full">
          
          {/* Email Field */}
          <div className="w-11/12">
            <InputField 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div className="w-11/12">
            <InputField 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <LoginButton type="submit" className="w-full bg-black text-white py-3 rounded-lg">
            Login
          </LoginButton>
        </form>
      </div>

      {/* Register Redirect */}
      <div className="flex flex-col items-center mb-4 w-4/5 mx-auto">
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register_lessor" className="text-blue-400">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
