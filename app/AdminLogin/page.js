"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../config/supabaseClient";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(null);

  useEffect(() => {
    // Clear session storage when landing on this page
    sessionStorage.clear();

    // Check lockout status from localStorage
    const lockoutEnd = localStorage.getItem("lockoutEnd");
    if (lockoutEnd) {
      const timeLeft = parseInt(lockoutEnd) - Date.now();
      if (timeLeft > 0) {
        setLockoutTimeLeft(timeLeft);
        const timer = setInterval(() => {
          const timeRemaining = parseInt(lockoutEnd) - Date.now();
          if (timeRemaining <= 0) {
            clearInterval(timer);
            localStorage.removeItem("lockoutEnd");
            setLockoutTimeLeft(null);
          } else {
            setLockoutTimeLeft(timeRemaining);
          }
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (lockoutTimeLeft) return;

    try {
      // Call Supabase to get user data
      const { data, error } = await supabase
        .from("admin")
        .select("admin_id, email, password")
        .eq("email", email)
        .single();

      if (error || !data || data.password !== password) {
        setErrorMessage("Invalid email or password.");
        const failedAttempts = parseInt(localStorage.getItem("failedAttempts")) || 0;
        const newFailedAttempts = failedAttempts + 1;
        localStorage.setItem("failedAttempts", newFailedAttempts);

        if (newFailedAttempts >= 3) {
          const lockoutDuration = 30 * 1000; // 30 seconds
          const lockoutEnd = Date.now() + lockoutDuration;
          localStorage.setItem("lockoutEnd", lockoutEnd);
          setLockoutTimeLeft(lockoutDuration);
        }
      } else {
        // Login successful
        setErrorMessage("");
        localStorage.removeItem("failedAttempts");
        localStorage.removeItem("lockoutEnd");
        sessionStorage.setItem("admin_id", data.admin_id);
        router.push("/AdminMenu");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-80 text-center">
        <img src="admin-logo.png" alt="Parkify Logo" className="mx-auto mb-4 w-50 h-50" />

        <div className="mt-8">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
              disabled={lockoutTimeLeft}
            />
          </div>

          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
              disabled={lockoutTimeLeft}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          {lockoutTimeLeft ? (
            <p className="text-red-500 mb-4">
              Too many failed attempts. Please wait for {Math.ceil(lockoutTimeLeft / 1000)} seconds to try again.
            </p>
          ) : null}

          <button
            onClick={handleLogin}
            className={`w-full ${
              lockoutTimeLeft ? "bg-gray-400" : "bg-gray-900"
            } text-white py-3 rounded-lg font-semibold mb-10`}
            disabled={lockoutTimeLeft}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
