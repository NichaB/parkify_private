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
  const lessorId = sessionStorage.getItem('lessorId'); // Assuming lessor_id is stored here
  const fileUploadRef = useRef(null);

  const [lessorData, setLessorData] = useState({
    locationName: '',
    address: '',
    locationUrl: '',
    totalSlots: '',
    availableSlots: '',
    pricePerHour: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if required fields are filled
    if (!lessorData.locationName || !lessorData.address || !lessorData.locationUrl || !lessorData.totalSlots || !lessorData.availableSlots || !lessorData.pricePerHour) {
      toast.error('Please fill in all fields');
      return;
    }
  
    // Capitalize the locationName field only
    const capitalize = (text) => text.replace(/\b\w/g, (char) => char.toUpperCase());
    const capitalizedLocationName = capitalize(lessorData.locationName);
  
    // Trigger file upload and get the file URL directly
    let uploadedFileURL = null;
    if (fileUploadRef.current) {
      uploadedFileURL = await fileUploadRef.current.handleUpload(); // Start upload and get URL
    }
  
    // If upload failed, exit function
    if (!uploadedFileURL) return;
  
    // Proceed with inserting lessor data into the database
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('parking_lot')
        .insert([{
          lessor_id: lessorId,
          location_name: capitalizedLocationName, // Use the capitalized location name
          address: lessorData.address,
          location_url: lessorData.locationUrl,
          total_slots: parseInt(lessorData.totalSlots, 10),
          available_slots: parseInt(lessorData.totalSlots, 10),
          price_per_hour: parseFloat(lessorData.pricePerHour),
          location_image: uploadedFileURL, // Use the uploaded file URL
        }]);
  
      if (insertError) {
        toast.error('An error occurred while registering. Please try again.');
        return;
      }
  
      toast.success('Lessor registration successful!');
      router.push('/profile'); // Redirect to profile or another appropriate page
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      <div className="relative flex-grow overflow-y-auto p-6">

        <button 
          onClick={() => router.push('/welcome')} 
          className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-4">
          Lessor Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          <div className="w-11/12">
            <input
              type="text"
              name="locationName"
              placeholder="Parking Name"
              value={lessorData.locationName}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ textTransform: 'capitalize' }}
            />
          </div>


          <div className="w-11/12">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={lessorData.address}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="text"
              name="locationUrl"
              placeholder="Location URL"
              value={lessorData.locationUrl}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <input
              type="number"
              name="totalSlots"
              placeholder="Total Slots"
              value={lessorData.totalSlots}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <div className="w-11/12">
            <input
              type="number"
              name="pricePerHour"
              placeholder="Price per Hour"
              value={lessorData.pricePerHour}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-11/12">
            <h2 className="text-gray-600 font-semibold mb-2">Location Image</h2>
            <FileUpload
              ref={fileUploadRef}
              storageBucket="carpark"
              fileName={`${uuidv4()}.jpg`}
            />
          </div>

          <div className="flex justify-center mb-4 w-4/5 mx-auto"> 
            <button type="submit" className="w-full bg-customBlue text-white py-3 rounded-lg hover:bg-blue-100">
              Register Lessor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
