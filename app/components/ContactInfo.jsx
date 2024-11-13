// src/components/ContactInfo.js
"use client";
import React, { useEffect, useState } from 'react';
import supabase from '../../config/supabaseClient';

const ContactInfo = () => {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        // Fetch contact information from Supabase
        const fetchContact = async () => {
            const { data, error } = await supabase
                .from('lessor')
                .select('lessor_firstname, lessor_lastname, lessor_phone_number, lessor_profile_pic')
                .eq('lessor_id', 99) // Adjust this ID as per your needs
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
                    src={contact ? contact.lessor_profile_pic : 'default_image.png'} // Use the fetched image URL or a default
                    alt="Contact"
                    className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                    <h3 className="text-lg font-semibold text-black">
                        {contact ? (
                            <>
                                <span>{contact.lessor_firstname}</span>
                                <span className="ml-2">{contact.lessor_lastname}</span> {/* Adjust `ml-2` as needed */}
                            </>
                        ) : 'Loading...'}
                    </h3>
                    <p className="text-gray-500">
                        {contact ? contact.lessor_phone_number : 'Loading...'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
