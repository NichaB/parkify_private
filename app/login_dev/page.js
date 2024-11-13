"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/router if using Next.js 12
import { supabase } from "../../config/supabaseClient"; // Correct path for your supabaseClient

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call the raw SQL function in Supabase to check user login
      const { data, error } = await supabase.rpc('check_user_login', {
        user_email: email,
        user_password: password
      });

      if (error) {
        console.error("Error querying Supabase:", error);
        alert("An error occurred. Please try again.");
        return;
      }

      if (data && data.length > 0) {
        // Login successful
        router.push("/home_dev"); // Navigate to the issue report page
      } else {
        // Login failed
        alert("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white px-4">
      <div className="text-center mb-8">
        <div className="rounded-full w-100 h-100 flex justify-center items-center mb-4">
          <img
            src="/images/Brand.png" // Ensure this image exists in your public/images directory
            alt="Parking Icon"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-3 rounded-md text-lg hover:bg-gray-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
