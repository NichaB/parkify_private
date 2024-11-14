// pages/index.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PlaceCard from "../components/PlaceCard";
import BottomNav from "../components/BottomNav";
import supabase from "../../config/supabaseClient";

export default function HomePage() {
    const [userName, setUserName] = useState("");
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchUserName = async () => {
            const { data, error } = await supabase
                .from("lessor")
                .select("lessor_firstname")
                .eq("lessor_id", 1)
                .single();

            if (!error && data) {
                setUserName(`${data.lessor_firstname}`);
            }
        };

        const fetchReservations = async () => {
            const { data, error } = await supabase
                .from("reservation")
                .select("location, reservation_date, start_time, end_time, duration_hour")
                .eq("user_id", 1); // Use the actual user_id

            if (error) {
                console.error("Error fetching reservations:", error.message);
            } else {
                setReservations(data);
            }
        };

        fetchUserName();
        fetchReservations();
    }, []);

    return (
        <div className="min-h-screen bg-white p-6 pb-20">
            <Header userName={userName} />
            <SearchBar />

            {/* Reservations Section */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Reservations</h2>
                <div className="space-y-4">
                    {reservations.map((reservation, index) => (
                        <div key={index} className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold">Reserved</h3>
                                <span className="bg-gray-600 py-1 px-3 rounded-lg text-sm">YWT001</span>
                            </div>
                            <p><strong>Location:</strong> {reservation.location || 'Yaowarat'}</p>
                            <p><strong>Time:</strong> {reservation.start_time} - {reservation.end_time}</p>
                            <p><strong>Date:</strong> {reservation.reservation_date}</p>
                            <div className="flex justify-between items-center mt-4">
                                <button className="bg-red-500 text-white py-2 px-4 rounded-lg">Cancel</button>
                                <span className="text-2xl font-bold">{reservation.duration_hour} HOURS</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
