// src/components/BookingInfo.js
import React from 'react';

const BookingInfo = () => {
    return (
        <div className="bg-grey-100 p-4 rounded-lg mb-4">
            <div className="mb-4">
                <label className="text-gray-500 text-sm mb-1 block">DATE</label>
                <div className="flex space-x-4">
                    <input type="date" className="w-full p-2 rounded-md border border-gray-300 text-black" placeholder="Start Date" />
                    <input type="date" className="w-full p-2 rounded-md border border-gray-300 text-black" placeholder="End Date" />
                </div>
            </div>

            <div className="mb-4">
                <label className="text-gray-500 text-sm mb-1 block">TIME</label>
                <div className="flex space-x-4">
                    <input type="time" className="w-full p-2 rounded-md border border-gray-300 text-black" placeholder="Start Time" />
                    <input type="time" className="w-full p-2 rounded-md border border-gray-300 text-black" placeholder="End Time" />
                </div>
            </div>

            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span className="text-gray-500 text-2xl font-semibold">TOTAL</span>
                <div className="bg-white py-1 px-3 rounded-lg text-sm font-medium text-black">
                    Remaining <span className="text-green-500 font-semibold">5</span>/10
                </div>
            </div>
        </div>
    );
};

export default BookingInfo;
