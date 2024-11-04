'use client';
import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import supabase from '../../config/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function ParkingLotSetting() {
  const router = useRouter();
  const fileUploadRefs = useRef([]);

  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const lessorId = '1'; // Replace with actual lessorId retrieval from sessionStorage if needed
      if (!lessorId) {
        toast.error("User ID not found");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('parking_lot')
          .select('parking_lot_id, location_name, address, location_url, total_slots, price_per_hour, location_image')
          .eq('lessor_id', lessorId);

        if (error) throw error;

        setParkingLots(data || []);
      } catch (error) {
        toast.error("Error fetching data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setParkingLots((prevData) =>
      prevData.map((lot, i) =>
        i === index ? { ...lot, [name]: value } : lot
      )
    );
  };

  const handleSave = async (index) => {
    const lot = parkingLots[index];

    if (!lot.location_name || !lot.address || !lot.location_url || !lot.total_slots || !lot.price_per_hour) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      let newImagePath = lot.location_image;
      const file = fileUploadRefs.current[index]?.files[0];

      // If a new file is uploaded, handle image upload and deletion
      if (file) {
        const fileName = `${uuidv4()}.jpg`;

        // Delete previous image if it exists
        if (lot.location_image) {
          const { error: deleteError } = await supabase.storage
            .from('carpark')
            .remove([lot.location_image]);

          if (deleteError) {
            console.error('Error deleting previous image:', deleteError);
            toast.error('Error deleting previous image.');
          }
        }

        // Upload new image
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('carpark')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        newImagePath = uploadData.path;
      }

      // Update the parking lot data in Supabase
      const { error } = await supabase
        .from('parking_lot')
        .update({
          location_name: lot.location_name,
          address: lot.address,
          location_url: lot.location_url,
          total_slots: lot.total_slots,
          price_per_hour: lot.price_per_hour,
          location_image: newImagePath,
        })
        .eq('parking_lot_id', lot.parking_lot_id);

      if (error) throw error;

      // Update state to reflect the new image
      setParkingLots((prevData) =>
        prevData.map((lotItem, i) =>
          i === index ? { ...lotItem, location_image: newImagePath } : lotItem
        )
      );

      toast.success('Parking lot settings saved!');
    } catch (error) {
      toast.error('Error saving data');
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      <div className="relative flex-grow overflow-y-auto p-6">
        <button 
          onClick={() => router.push('/setting')} 
          className="absolute top-10 left-4 flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 shadow-sm text-black"
        >
          <FaArrowLeft className="w-6 h-6" />
        </button>
        
        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-16 py-4">
          Parking Lots Setting
        </h1>

        {parkingLots.map((lot, index) => (
          <div key={lot.parking_lot_id} className="space-y-6 mb-8 p-6 border rounded-lg shadow-lg w-11/12 mx-auto bg-white">
            {lot.location_image ? (
              <img
                src={`https://your-supabase-storage-url/${lot.location_image}`}
                alt="Parking Lot"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 flex flex-col items-center">
              <div className="w-full relative">
                <label className="block text-gray-500">Parking Name</label>
                <div className="flex items-center relative">
                  <input
                    type="text"
                    name="location_name"
                    value={lot.location_name}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaEdit className="absolute right-4 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div className="w-full relative">
                <label className="block text-gray-500">Address</label>
                <div className="flex items-center relative">
                  <input
                    type="text"
                    name="address"
                    value={lot.address}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaEdit className="absolute right-4 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div className="w-full relative">
                <label className="block text-gray-500">Location URL</label>
                <div className="flex items-center relative">
                  <input
                    type="text"
                    name="location_url"
                    value={lot.location_url}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaEdit className="absolute right-4 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div className="w-full relative">
                <label className="block text-gray-500">Total Slots</label>
                <div className="flex items-center relative">
                  <input
                    type="number"
                    name="total_slots"
                    value={lot.total_slots}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaEdit className="absolute right-4 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div className="w-full relative">
                <label className="block text-gray-500">Price per Hour</label>
                <div className="flex items-center relative">
                  <input
                    type="number"
                    name="price_per_hour"
                    value={lot.price_per_hour}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaEdit className="absolute right-4 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-gray-500">Location Image</label>
                <input
                  ref={(el) => (fileUploadRefs.current[index] = el)}
                  type="file"
                  accept="image/*"
                  className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSave(index)}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
              >
                SAVE
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-full flex justify-around items-center bg-white py-2 border-t border-gray-200">
        <button onClick={() => router.push('/home')} className="text-gray-500">
          <img src="/home.png" alt="Home" className="w-6 h-6" />
        </button>
        <button onClick={() => router.push('/setting')} className="text-red-500">
          <img src="/setting_selected.png" alt="Settings" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}