'use client';
import React, { useState } from 'react';
import supabase from '../../config/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      // Check if the email exists in your database
      const { data: userData, error: userError } = await supabase
        .from('user_info')
        .select('email')
        .eq('email', email);

      if (userError) throw userError;

      if (userData.length > 0) {
        // Proceed with password reset
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage('Password reset email sent! Please check your inbox.');
        }
      } else {
        setMessage("The email address isn't registered in our system.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
