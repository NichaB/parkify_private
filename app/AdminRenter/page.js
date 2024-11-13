"use client";
import React, { useEffect, useState } from 'react';
import { FaUser, FaPen } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import supabase from '../../config/supabaseClient';

const Renters = () => {
    const [renters, setRenters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // Fetch users from Supabase
    useEffect(() => {
        const fetchRenters = async () => {
            const { data, error } = await supabase
                .from('user_info')
                .select('user_id, first_name, last_name');

            if (error) {
                console.error("Error fetching renters:", error);
            } else {
                setRenters(data);
            }
        };

        fetchRenters();
    }, []);

    // Filter renters based on search query
    const filteredRenters = renters.filter(renter =>
        `${renter.first_name} ${renter.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle navigation to edit page
    const handleEditClick = (userId) => {
        sessionStorage.setItem('user_id', userId); // Store user_id in sessionStorage
        router.push('/AdminRenterEdit'); // Redirect to edit page without user_id in the URL
    };

    // Navigate back to AdminMenu
    const handleBackClick = () => {
        router.push('/AdminMenu');
    };

    return (
        <div className="p-4">
            {/* Back Button */}
            <button onClick={handleBackClick} className="text-blue-500 underline mb-4">Back to Admin Menu</button>

            <h1 className="text-2xl font-bold mb-4">Renters</h1>

            {/* Search Bar */}
            <div className="relative mb-4">
                <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-grey-100 rounded-full p-2">
                    <svg width="24" height="24" fill="currentColor" className="text-gray-500">
                        <path d="M9 19c-1.3 0-2.6-.5-3.5-1.5C4.5 16.6 4 15.3 4 14s.5-2.6 1.5-3.5C6.4 9.5 7.7 9 9 9s2.6.5 3.5 1.5C13.5 11.4 14 12.7 14 14s-.5 2.6-1.5 3.5C11.6 18.5 10.3 19 9 19zM5 14c0 1.1.4 2.1 1.2 2.8C7.9 17.6 8.9 18 10 18c1.1 0 2.1-.4 2.8-1.2.8-.8 1.2-1.8 1.2-2.8s-.4-2.1-1.2-2.8C12.1 10.4 11.1 10 10 10c-1.1 0-2.1.4-2.8 1.2-.8-.8 1.2-1.8 1.2-2.8z" />
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 p-2 rounded-md border border-gray-300"
                />
            </div>

            {/* Display Filtered Renters */}
            {filteredRenters.map(renter => (
                <div key={renter.user_id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                        <FaUser className="text-xl mr-3 text-black" />
                        <span className="font-semibold text-black">{renter.first_name} {renter.last_name}</span>
                    </div>
                    <button onClick={() => handleEditClick(renter.user_id)} className="flex items-center text-black">
                        <FaPen className="text-xl mr-2" />
                        Edit Info
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Renters;
