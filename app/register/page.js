'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import RegisterButton from '../components/RegisterButton';
import { InputField } from '../components/InputField';
import Link from 'next/link';
import supabase from '../../config/supabaseClient'; // Import your Supabase client instance

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Check if the email already exists
      const { data: emailCheckData, error: emailCheckError } = await supabase
        .from('user_info') // Ensure this matches your table name
        .select('email')
        .eq('email', formData.email)
        .single(); // Retrieve a single row

      // Handle errors from the email check
      if (emailCheckError && emailCheckError.code !== 'PGRST116') { // Ignore error for no rows found
        console.error('Error checking email:', emailCheckError.message);
        toast.error('An error occurred while checking the email. Please try again.');
        return;
      }

      // If email already exists, notify the user
      if (emailCheckData) {
        toast.error('Email already exists. Please use a different email.');
        return;
      }
      
      // Proceed with registration logic if email does not exist
      console.log('Email is not registered. Proceed with registration.');

      
      // Redirect to the profile page with user data as query parameters
      // router.push(`/profile?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`);
      router.push('/regisProfile');
      sessionStorage.setItem('userEmail', formData.email);
      sessionStorage.setItem('userPassword', formData.password);
      // router.push({
      //   pathname: '/profile',
      //   query: { email: formData.email, password: formData.password },  // Pass email to the profile page
      // });

    } catch (error) {
      console.error('Unexpected error:', error.message);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />

      {/* Back Button */}
      <button 
        onClick={() => router.push('/welcome')} 
        className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-10">
        Hello! Register to get <br /> started
      </h1>

      <div className="flex-grow flex flex-col items-center w-full px-6">
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center w-full">
          <div className="w-11/12">
            <InputField 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <InputField 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <InputField 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>

      <div className="flex flex-col items-center mb-4 w-4/5 mx-auto">
        <RegisterButton variant="black" type="submit" className="w-full bg-black text-white py-3 rounded-lg" onClick={handleSubmit}>
          Register
        </RegisterButton>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}
