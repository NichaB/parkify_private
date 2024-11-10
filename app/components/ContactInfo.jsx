// src/components/ContactInfo.js
"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ContactInfo = () => {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        // Fetch contact information from Supabase
        const fetchContact = async () => {
            const { data, error } = await supabase
                .from('lessor') // replace with your actual table name
                .select('lessor_firstname, lessor_phone_number')
                .eq('lessor_id', 1) // adjust the condition based on your requirements
                .single();

            if (error) {
                console.error('Error fetching contact:', error);
            } else {
                setContact(data);
            }
        };

        fetchContact();
    }, []);

    return (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
                <img
                    src="user_icon.png" // Replace with actual profile picture URL
                    alt="Contact"
                    className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                    <h3 className="text-lg font-semibold text-black">
                        {contact ? contact.name : 'Loading...'}
                    </h3>
                    <p className="text-gray-500">
                        {contact ? contact.phone : 'Loading...'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
