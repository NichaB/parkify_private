// pages/index.js
"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PlaceCard from "../components/PlaceCard";
import BottomNav from "../components/BottomNav";
import { supabase } from "../../config/supabaseClient"; // Correct path for your supabaseClient

export default function HomePage() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const { data, error } = await supabase
                    .from("lessor") // Replace with your actual table name
                    .select("lessor_firstname")
                    .eq("lessor_id", 1)
                    .single(); // Fetch a single record with lessor_id = 1

                if (error) {
                    console.error("Error fetching user name:", error.message || error);
                } else if (data) {
                    // Combine first and last name
                    setUserName(`${data.lessor_firstname}`);
                } else {
                    console.warn("No data returned from Supabase.");
                }
            } catch (err) {
                console.error("Unexpected error fetching data from Supabase:", err);
            }
        };

        fetchUserName();
    }, []);


    return (
        <div className="min-h-screen bg-white p-6 pb-20">
            {/* Header */}
            <Header userName={userName} />

            {/* Search Bar */}
            <SearchBar />

            {/* Recent Places Section */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Places</h2>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto space-x-4 pb-2">
                    <Link href="/search?place=Yaowarat">
                        <PlaceCard imageSrc="/images/yaowarat.jpg" name="Yaowarat" />
                    </Link>
                    <Link href="/search?place=Siam">
                        <PlaceCard imageSrc="/images/siam.jpg" name="Siam" />
                    </Link>
                    <Link href="/search?place=Don Muang">
                        <PlaceCard imageSrc="/images/donmuang.jpg" name="Don Muang" />
                    </Link>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}