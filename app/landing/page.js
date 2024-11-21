"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineSound, AiFillSound } from "react-icons/ai";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const LandingPage = () => {
  const router = useRouter();

  const [audioMuted, setAudioMuted] = useState(true);
  const [audio, setAudio] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    sessionStorage.clear();

    const audioElement = new Audio("/RaceCar.mp3");
    audioElement.loop = true;
    setAudio(audioElement);

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []);

  const navigateWithAudioStop = (path) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background GIF */}
      <div className="absolute inset-0">
        <img
          src="/badparking.gif"
          alt="Background GIF"
          className="w-full h-full object-cover"
        />
      </div>

      {/* White Mask */}
      <div className="absolute inset-0 bg-gray-400 opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full px-4 py-8">
        {/* Logo */}
        <img
          src="logo.png"
          alt="Parkify Logo"
          className="w-48 md:w-64 mb-6 max-w-full"
        />

        {/* Sound Button */}
        <button
          onClick={toggleAudio}
          className="z-20 text-xl p-3 bg-white rounded-full shadow-lg mb-6"
        >
          {audioMuted ? (
            <AiOutlineSound className="text-gray-600" />
          ) : (
            <AiFillSound className="text-blue-500" />
          )}
        </button>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
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
    </div>
  );
};

export default LandingPage;
