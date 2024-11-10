import React from 'react';
import { FaUser, FaPen } from 'react-icons/fa';

const rentersData = [
    { id: 1, name: 'Giovanni Ricci' },
    { id: 2, name: 'Arisa Nakamura' },
    { id: 3, name: 'Carlos Martinez' },
];

const Renters = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Renters</h1>

            <div className="relative mb-4">
                <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-100 rounded-full p-2">
                    <svg width="24" height="24" fill="currentColor" className="text-gray-500">
                        <path d="M9 19c-1.3 0-2.6-.5-3.5-1.5C4.5 16.6 4 15.3 4 14s.5-2.6 1.5-3.5C6.4 9.5 7.7 9 9 9s2.6.5 3.5 1.5C13.5 11.4 14 12.7 14 14s-.5 2.6-1.5 3.5C11.6 18.5 10.3 19 9 19zM5 14c0 1.1.4 2.1 1.2 2.8C7.9 17.6 8.9 18 10 18c1.1 0 2.1-.4 2.8-1.2.8-.8 1.2-1.8 1.2-2.8s-.4-2.1-1.2-2.8C12.1 10.4 11.1 10 10 10c-1.1 0-2.1.4-2.8 1.2-.8.8-1.2 1.8-1.2 2.8zm11 0c0-1.1-.4-2.1-1.2-2.8C13.1 10.4 12.1 10 11 10c-1.1 0-2.1.4-2.8 1.2-.8.8-1.2 1.8-1.2 2.8s.4 2.1 1.2 2.8C8.9 17.6 9.9 18 11 18c1.1 0 2.1-.4 2.8-1.2.8-.8 1.2-1.8 1.2-2.8z" />
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-12 p-2 rounded-md border border-gray-300"
                />
            </div>

            {rentersData.map(renter => (
                <div key={renter.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                        <FaUser className="text-xl mr-3" />
                        <span className="font-semibold">{renter.name}</span>
                    </div>
                    <FaPen className="text-xl cursor-pointer" />
                </div>
            ))}
        </div>
    );
};

export default Renters;
