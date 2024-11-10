// RegisterInformationPage.js
'use client';
import React, { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import supabase from '../../config/supabaseClient';
import FileUpload from '../../config/fileUpload';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterInformationPage() {
  const router = useRouter();
  const userId = sessionStorage.getItem('userId');
  const fileUploadRef = useRef(null);

  const [carData, setCarData] = useState({
    carModel: '',
    carColor: '',
    licensePlateNumber: '',
  });

  const [fileURL, setFileURL] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if required fields are filled
    if (!carData.carModel || !carData.licensePlateNumber || !carData.carColor) {
      toast.error('Please fill in all fields');
      return;
    }
  
    // Trigger file upload
    if (fileUploadRef.current) {
      await fileUploadRef.current.handleUpload();
    }
  
    // Ensure fileURL is set before proceeding with insertion
    if (!fileURL) {
      toast.error('Please upload an image');
      return;
    }
  
    // Proceed with inserting car data into the database via the API
    try {
      const response = await fetch('/api/registerCar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          carModel: carData.carModel,
          carColor: carData.carColor,
          licensePlateNumber: carData.licensePlateNumber,
          fileURL,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'An error occurred while registering the car.');
      }
  
      toast.success(result.message || 'Car registration successful!');
      router.push('setting'); // Redirect to the profile page
    } catch (error) {
      toast.error(error.message);
      console.error('Registration error:', error);
    }
  };
  

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      <div className="relative flex-grow overflow-y-auto p-6">
        <button onClick={() => router.push('/welcome')} className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-4">
          Car Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          <div className="w-11/12">
            <input
              type="text"
              name="carModel"
              placeholder="Car Model"
              value={carData.carModel}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="carColor"
              placeholder="Car Color"
              value={carData.carColor}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="licensePlateNumber"
              placeholder="License Plate Number"
              value={carData.licensePlateNumber}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <h2 className="text-gray-600 font-semibold mb-2">Car Image</h2>
            <FileUpload
              ref={fileUploadRef}
              storageBucket="car_image"
              fileName={`${uuidv4()}.jpg`}
              setFileURL={setFileURL}
            />
          </div>

          <div className="flex justify-center mb-4 w-4/5 mx-auto"> 
            <button type="submit" className="w-full bg-customBlue text-white py-3 rounded-lg hover:bg-blue-100">
              Register Car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
