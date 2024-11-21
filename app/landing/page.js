"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineSound, AiFillSound } from "react-icons/ai";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const LandingPage = () => {
  const router = useRouter();

  const [audioMuted, setAudioMuted] = useState(true); // State to track if audio is muted or not
  const [audio, setAudio] = useState(null); // State to hold the audio element
  const [audioPlayed, setAudioPlayed] = useState(false); // State to check if audio has started

  useEffect(() => {
    sessionStorage.clear();

    const audioElement = new Audio("/RaceCar.mp3");
    audioElement.loop = true;
    setAudio(audioElement);

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0; // Reset the audio playback
      }
    };
  }, []);

  const navigateWithAudioStop = (path) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reset audio playback
    }
    router.push(path);
  };

  const toggleAudio = () => {
    if (!audioPlayed) {
      audio.play();
      setAudioPlayed(true);
    }
    setAudioMuted(!audioMuted);
    audio.muted = !audioMuted;
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Background GIF */}
      <img
        src="/badparking.gif"
        alt="Background GIF"
        className="absolute inset-0 w-full h-full object-cover min-h-screen"
      />

      {/* White Mask */}
      <div className="absolute inset-0 bg-gray-400 opacity-60 z-10"></div>

      {/* Logo and Content */}
      <div className="flex flex-col items-center justify-center p-4 z-20 space-y-4">
        {/* Logo */}
        <img
          src="logo.png"
          alt="Parkify Logo"
          className="w-48 md:w-64 max-w-full"
        />

        {/* Sound Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={toggleAudio}
            className="z-20 text-xl p-2 bg-white rounded-full shadow-lg"
          >
            {audioMuted ? (
              <AiOutlineSound className="text-gray-600" />
            ) : (
              <AiFillSound className="text-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl p-4 z-20">
        <button
          onClick={() => navigateWithAudioStop("/welcomelessor")}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200"
        >
          <img src="lessor.png" alt="Lessor Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold text-center">Lessor</span>
        </button>

        <button
          onClick={() => navigateWithAudioStop("/welcomerenter")}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200"
        >
          <img src="renter.png" alt="Renter Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold text-center">Renter</span>
        </button>

        <button
          onClick={() => navigateWithAudioStop("/AdminLogin")}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200"
        >
          <img src="admin.png" alt="Admin Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold text-center">Admin</span>
        </button>

        <button
          onClick={() => navigateWithAudioStop("start_dev")}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200"
        >
          <img src="dev.png" alt="Developer Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold text-center">Developer</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
