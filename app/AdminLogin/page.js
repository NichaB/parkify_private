// src/components/AdminLogin.jsx
"use client";
import React, { useState } from 'react';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-80 text-center">
                {/* Logo */}
                <img src="Parkify_Admin_Logo.png" alt="Parkify Logo" className="mx-auto mb-4 w-50 h-50" /> {/* Replace with actual logo image */}

                {/* Input Fields */}
                <div className="mt-8">
                    {/* Email Input */}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                        >
                            {showPassword ? '🙈' : '👁️'} {/* This can be an icon */}
                        </button>
                    </div>

                    {/* Login Button */}
                    <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
