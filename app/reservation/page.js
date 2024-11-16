'use client';
import React, { useEffect, useState } from 'react';
import ContactInfo from '../components/ContactInfo';
import ReservationSection from '../components/ReservationSection';

const ParkingDetail = () => {
  const [parkingDetails, setParkingDetails] = useState(null);
  const [userCars, setUserCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch parking details on component mount
  useEffect(() => {
    const fetchParkingDetails = async () => {
      try {
        const parkingLotId = sessionStorage.getItem('parkingLotId');
        if (!parkingLotId) {
          throw new Error('Parking lot ID is missing in session storage.');
        }

        const response = await fetch(`/api/LocationandPrice?id=${parkingLotId}`);
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.error || 'Failed to fetch parking details.');
        }

        const data = await response.json();
        setParkingDetails(data); // parkingDetails now contains parkingLotId
      } catch (err) {
        setError(err.message || 'Failed to load parking details.');
      }
    };

    fetchParkingDetails();
  }, []);

  // Fetch user cars on component mount
  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID is missing in session storage.');
        }

        const response = await fetch(`/api/fetchCar?userId=${userId}`);
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.error || 'Failed to fetch user cars.');
        }

        const data = await response.json();
        setUserCars(data.cars || []);
      } catch (err) {
        setError(err.message || 'Failed to load user cars.');
      }
    };

    fetchUserCars();
  }, []);

  // Handle car selection
  const handleCarSelection = (e) => {
    const carId = e.target.value;
    setSelectedCarId(carId);
    sessionStorage.setItem('carId', carId); // Store selected car ID in session storage
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!parkingDetails) {
    return <p className="text-gray-500 text-center">Loading...</p>;
  }

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-lg p-6 lg:p-12">
        <img
          src="parkinglots-image.jpg"
          alt="Parking Lot"
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-6">
          <span className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full text-base lg:text-xl">
            {parkingDetails.parkingCode}
          </span>
          <span className="bg-green-500 text-white font-bold px-4 py-2 rounded-full text-base lg:text-xl">
            {parkingDetails.price}
          </span>
        </div>
        <p className="text-md font-semibold text-gray-800 mb-2">
          Address: {parkingDetails.address}
        </p>
        <ContactInfo lessorDetails={parkingDetails.lessorDetails} />

        {/* Car Selection Combobox */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Select Your Car:</h3>
          {userCars.length > 0 ? (
            <select
              value={selectedCarId || ''}
              onChange={handleCarSelection}
              className="w-full bg-gray-200 text-gray-700 border border-gray-300 rounded-lg py-2 px-4"
            >
              <option value="" disabled>
                Select your car
              </option>
              {userCars.map((car) => (
                <option key={car.car_id} value={car.car_id}>
                  {car.car_model} - {car.car_color} - {car.license_plate}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-600">No cars registered.</p>
          )}
        </div>

        {/* Reservation Section */}
        <ReservationSection
          parkingDetails={parkingDetails} // Pass parkingDetails (including parkingLotId)
          selectedCarId={selectedCarId} // Pass selectedCarId
        />
      </div>
    </div>
  );
};

export default ParkingDetail;
