"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../config/supabaseClient';

const AdminLogin = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (loginAttempts >= 3) {
            setIsLocked(true);
            setErrorMessage('Too many failed attempts. Please wait 30 seconds.');

            const timer = setTimeout(() => {
                setLoginAttempts(0);
                setIsLocked(false);
                setErrorMessage('');
            }, 30000); // Set to 30 seconds

            return () => clearTimeout(timer);
        }
    }, [loginAttempts]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        if (isLocked) return;

        const { data, error } = await supabase
            .from('admin')
            .select('admin_id, email, password')
            .eq('email', email)
            .single();

        if (error || !data || data.password !== password) {
            setErrorMessage('Invalid email or password.');
            setLoginAttempts((prev) => prev + 1);
        } else {
            setLoginAttempts(0);
            setErrorMessage('');
            sessionStorage.setItem('admin_id', data.admin_id); // Store admin_id in session storage
            router.push('/AdminMenu');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-80 text-center">
                <img src="Parkify_Admin_Logo.png" alt="Parkify Logo" className="mx-auto mb-4 w-50 h-50" />

                <div className="mt-8">
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
                            disabled={isLocked}
                        />
                    </div>

                    <div className="mb-6 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
                            disabled={isLocked}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                    <button
                        onClick={handleLogin}
                        className={`w-full ${isLocked ? 'bg-gray-400' : 'bg-gray-900'} text-white py-3 rounded-lg font-semibold`}
                        disabled={isLocked}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
