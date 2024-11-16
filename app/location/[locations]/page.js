"use client";

import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";
import React from "react";

export default function LocationPage({ params }) {
  const unwrappedParams = React.use(params);
  const location = decodeURIComponent(unwrappedParams.locations).toLowerCase();

  const router = useRouter();
  const [searchText, setSearchText] = useState(location || "");
  const [parkingData, setParkingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      setSearchText(location);
    }
  }, [location]);

  useEffect(() => {
    const fetchParkingData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/renterFetchParking?locationName=${encodeURIComponent(location)}`);
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.error || "Failed to fetch parking data.");
        }
        const { parkingLots } = await response.json();
        setParkingData(parkingLots);
        setError(null);
      } catch (err) {
        console.error("Error fetching parking data:", err);
        setError(err.message || "Failed to load parking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, [location]);

const handleParkingClick = (parkingLotId) => {
  sessionStorage.setItem("parkingLotId", parkingLotId); // Save parking lot ID
  router.push(`/reservation`); // Navigate to reservation page
};


  const getImageForLocation = (locationName) => {
    const locationImages = {
      yaowarat: "/images/yaowarat.jpg",
      siam: "/images/siam.jpg",
      "don muang": "/images/donmuang.jpg",
    };
    return locationImages[locationName.toLowerCase()] || null;
  };

  const locationImage = getImageForLocation(location);

  return (
    <div className="min-h-screen bg-white p-4 space-y-4">
      <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-md mt-7">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search location"
          className="flex-1 bg-transparent text-gray-700 focus:outline-none"
        />
        <button onClick={() => router.push("/search")}>
          <AiOutlineClose size={20} className="text-gray-500" />
        </button>
      </div>
      {locationImage && (
        <div className="rounded-lg overflow-hidden shadow-lg relative mb-8">
          <img
            src={locationImage}
            alt={location}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-center py-2">
            {location.charAt(0).toUpperCase() + location.slice(1)}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading parking data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : parkingData.length > 0 ? (
          parkingData.map((spot) => (
            <div
              key={spot.parking_lot_id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer"
              onClick={() => handleParkingClick(spot.parking_lot_id)}
            >
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{spot.price_per_hour} THB / Hour</h3>
                <p className="text-sm text-gray-500">{spot.address}</p>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src="/images/parking-icon.png"
                  alt="Parking Icon"
                  className="w-8 h-8"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No parking spots available for {location}</p>
        )}
      </div>
    </div>
  );
}
