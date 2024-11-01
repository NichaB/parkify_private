'use client';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';;
import { useRouter } from 'next/navigation';
import supabase from '../../config/supabaseClient';

export default function RegisterInformationPage() {

 
  const router = useRouter();
  const email = sessionStorage.getItem('userEmail');
  const password = sessionStorage.getItem('userPassword');


  const [userData, setUserData] = useState({
    email: email || '', // Set initial state from query params or empty string
    password: password || '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    carModel: '',
    licensePrefix: '',
    licenseNumber: ''
  });

  // Update userData state for each input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate input fields
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.phoneNumber) {
        console.log('Validation failed: one or more fields are empty'); // Debug log
        toast.error('Please fill in all fields');
        return; // Early return if validation fails
    }

    // Proceed with the rest of the submit logic
    try {
        // Check if the phone number already exists
        const { data: phoneCheckData, error: phoneCheckError } = await supabase
            .from('user_info')
            .select('phone_number')
            .eq('phone_number', userData.phoneNumber)
            .single();

        // Handle errors from the phone check
        if (phoneCheckError && phoneCheckError.code !== 'PGRST116') {
            console.error('Error checking phone number:', phoneCheckError.message);
            toast.error('An error occurred while checking the phone number. Please try again.');
            return;
        }

        // If phone number already exists, notify the user
        if (phoneCheckData) {
            toast.error('Phone number already exists. Please use a different phone number.');
            return;
        }

        // Insert new user data into user_info table
        const { data: insertData, error: insertError } = await supabase
            .from('user_info')
            .insert([{
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                phone_number: userData.phoneNumber,
                password: userData.password, // Ensure to hash this in production
            }]);

        if (insertError) {
            console.error('Error inserting user data:', insertError.message);
            toast.error('An error occurred while registering. Please try again.');
            return;
        }

        // Notify user of successful registration
        toast.success('Registration successful!');
        router.push('/profile'); // Redirect to profile page
    } catch (error) {
        console.error('Unexpected error:', error.message);
        toast.error('An unexpected error occurred. Please try again later.');
    }
};
  return (
    <div className="flex flex-col h-screen bg-white">
       <Toaster />
      <div className="relative flex-grow overflow-y-auto p-6">
        
        {/* Back Button */}
        <button 
            onClick={() => router.push('/welcome')} 
            className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-4">
          Your Information for a <br /> Smooth Reservation Experience
        </h1>

      
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Phone Number */}
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

          {/* Car Information */}
          <div className="w-11/12">
            <h2 className="text-gray-600 font-semibold mb-2">Car Information</h2>
            <input
              type="text"
              name="carModel"
              placeholder="Car model"
              value={userData.carModel}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* License Plate */}
          <div className="w-11/12">
            <h2 className="text-gray-600 font-semibold mb-2">License Plate</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                name="licensePrefix"
                placeholder="1 กก"
                value={userData.licensePrefix}
                onChange={handleChange}
                className="w-1/3 p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="licenseNumber"
                placeholder="1234"
                value={userData.licenseNumber}
                onChange={handleChange}
                className="flex-grow p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Car Image */}
          <div className="w-11/12">
            <h2 className="text-gray-600 font-semibold mb-2">Car Image</h2>
            <p className="text-sm text-gray-500 mb-4">
              Please upload a photo of the <strong>front of your car</strong> with the license plate clearly visible.
            </p>

            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div> 

            <p className="text-xs text-gray-400 mt-2">You can add additional vehicles later in the <span className="underline">Settings page</span>.</p>
          </div>

          {/* Submit Button Inside the Form */}
          <div className="flex justify-center mb-4 w-4/5 mx-auto"> 
            <button type="submit" className="w-full bg-customBlue text-white py-3 rounded-lg hover:bg-blue-100" onClick={handleSubmit}>
              Get started
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
