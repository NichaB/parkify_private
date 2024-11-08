'use client';
import React, { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import supabase from '../../config/supabaseClient';
import FileUpload from '../../config/fileUpload';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterInformationPage() {
  const router = useRouter();
  const email = sessionStorage.getItem('userEmail');
  const password = sessionStorage.getItem('userPassword');
  const fileUploadRef = useRef(null);

  const [userData, setUserData] = useState({
    email: email || '',
    password: password || '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    lineurl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.phoneNumber || !userData.lineurl) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if profile image is uploaded
    let uploadedProfileImageUrl = null;
    if (fileUploadRef.current) {
      uploadedProfileImageUrl = await fileUploadRef.current.handleUpload();
    }

    if (!uploadedProfileImageUrl) {
      toast.error('Please upload a profile image.');
      return;
    }

    try {
      const { data: existingUser, error: phoneCheckError } = await supabase
        .from('lessor')
        .select('lessor_id')
        .eq('lessor_phone_number', userData.phoneNumber)
        .single();

      if (phoneCheckError && phoneCheckError.code !== 'PGRST116') {
        toast.error('An error occurred while checking the phone number. Please try again.');
        return;
      }

      if (existingUser) {
        toast.error('Phone number already exists. Please use a different phone number.');
        return;
      }

      const { data, error } = await supabase
        .from('lessor')
        .insert([{
          lessor_firstname: userData.firstName,
          lessor_lastname: userData.lastName,
          lessor_email: userData.email,
          lessor_phone_number: userData.phoneNumber,
          lessor_password: userData.password, // Make sure to hash in production
          lessor_line_url: userData.lineurl,
          lessor_image: uploadedProfileImageUrl // Set the uploaded image URL
        }])
        .select('lessor_id')
        .single();

      if (error) {
        toast.error('An error occurred while registering. Please try again.');
        return;
      }

      sessionStorage.setItem('lessorId', data.lessor_id);
      toast.success('Registration successful!');
      router.push('/regisPark');
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      <div className="relative flex-grow overflow-y-auto p-6">
        <button onClick={() => router.push('/welcomerentor')} className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-4">
          Your Information for a <br /> Smooth Reservation Experience
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          {/* Input fields */}
          <div className="w-11/12">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={userData.firstName}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={userData.lastName}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={userData.phoneNumber}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="lineurl"
              placeholder="Line URL"
              value={userData.lineurl}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Profile Image Upload */}
          <div className="w-11/12">
            <h2 className="text-gray-600 font-semibold mb-2">Profile Image</h2>
            <FileUpload
              ref={fileUploadRef}
              storageBucket="lessor_image"
              fileName={`${uuidv4()}.jpg`}
            />
          </div>

          <div className="flex justify-center mb-4 w-4/5 mx-auto">
            <button type="submit" className="w-full bg-customBlue text-white py-3 rounded-lg hover:bg-blue-500">
              Get started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
