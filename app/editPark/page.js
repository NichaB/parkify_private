// EditParking.js
'use client';
import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { v4 as uuidv4 } from 'uuid';

export default function EditParking() {
  const fileUploadRefs = useRef([]);
  const [lessorDetails, setLessorDetails] = useState({});
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingLots = async () => {
      const lessorId = '9'; // Update this to fetch lessor ID dynamically if needed
      try {
        const response = await fetch(`../api/fetchPark?lessorId=${lessorId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Error fetching data');

        setLessorDetails(data.lessorDetails);
        setParkingLots(data.parkingLots || []);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Error fetching parking lots');
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLots();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setParkingLots((prev) =>
      prev.map((lot, i) => (i === index ? { ...lot, [name]: value } : lot))
    );
  };

  const handleSave = async (index) => {
    const lot = parkingLots[index];
    const lessorId = '9';
    if (!lot.location_name || !lot.address || !lot.location_url || !lot.total_slots || !lot.price_per_hour) {
      toast.error('Please fill in all fields');
      return;
    }
  
    try {
      let newImagePath = lot.location_image;
      const file = fileUploadRefs.current[index]?.files[0];
  
      // Handle file upload if a new file is selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('storageBucket', 'carpark'); // Replace with actual storage bucket name
        formData.append('parkingLotId', lot.parking_lot_id); // Link image to this parking lot
  
        const uploadResponse = await fetch(`../api/uploadFile`, {
          method: 'POST',
          body: formData,
        });
        const uploadResult = await uploadResponse.json();
  
        if (!uploadResponse.ok) throw new Error(uploadResult.error || 'File upload failed');
        newImagePath = uploadResult.publicUrl;
      }
  
      const updateResponse = await fetch(`../api/fetchPark`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parkingLotId: lot.parking_lot_id,
          location_name: lot.location_name,
          address: lot.address,
          location_url: lot.location_url,
          total_slots: lot.total_slots,
          price_per_hour: lot.price_per_hour,
          location_image: newImagePath,
        }),
      });
  
      const updateResult = await updateResponse.json();
      if (!updateResponse.ok) throw new Error(updateResult.error || 'Update failed');
  
      setParkingLots((prev) =>
        prev.map((lotItem, i) =>
          i === index ? { ...lotItem, location_image: newImagePath } : lotItem
        )
      );
      toast.success('Parking lot settings saved!');
    } catch (error) {
      toast.error('Error saving data');
      console.error('Save error:', error);
    }
  };
  
  

  const handleDelete = async (index) => {
    const lot = parkingLots[index];
    try {

      const deleteResponse = await fetch(`../api/fetchPark?parkingLotId=${lot.parking_lot_id}`, {
        method: 'DELETE',
      });
      

      const deleteResult = await deleteResponse.json();
      if (!deleteResponse.ok) throw new Error(deleteResult.error || 'Delete failed');

      setParkingLots((prev) => prev.filter((_, i) => i !== index));
      toast.success('Parking lot deleted!');
    } catch (error) {
      toast.error('Error deleting parking lot');
      console.error('Delete error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      <div className="relative flex-grow overflow-y-auto p-6">
        <BackButton targetPage="/setting" />
        
        <h1 className="text-2xl font-bold text-black text-left w-full px-6 mt-5 py-4">
          Parking Lots Setting
        </h1>

        {parkingLots.map((lot, index) => (
          <div key={lot.parking_lot_id} className="space-y-6 mb-8 p-6 border rounded-lg shadow-lg w-11/12 mx-auto bg-white">
            {lot.location_image ? (
              <img src={lot.location_image} alt="Parking Lot" className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-4 mx-auto" />
            ) : (
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 flex flex-col items-center">
              {['location_name', 'address', 'location_url', 'total_slots', 'price_per_hour'].map((field) => (
                <div key={field} className="w-full relative">
                  <label className="block text-gray-500">{field.replace('_', ' ').toUpperCase()}</label>
                  <div className="flex items-center relative">
                    <input
                      type={field.includes('slots') || field.includes('price') ? 'number' : 'text'}
                      name={field}
                      value={lot[field]}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaEdit className="absolute right-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              ))}
              <div className="w-full">
                <label className="block text-gray-500">Location Image</label>
                <input ref={(el) => (fileUploadRefs.current[index] = el)} type="file" accept="image/*" className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none" />
              </div>

              <button type="button" onClick={() => handleSave(index)} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">SAVE</button>
              <button type="button" onClick={() => handleDelete(index)} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 mt-2">DELETE</button>
            </form>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
