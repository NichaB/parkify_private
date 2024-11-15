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
    // Create the audio element on component mount
    const audioElement = new Audio("/RaceCar.mp3");
    audioElement.loop = true;
    setAudio(audioElement);

    // Cleanup function to stop the audio when navigating away
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

  // Start playing the audio when the speaker icon is clicked
  const toggleAudio = () => {
    if (!audioPlayed) {
      audio.play(); // Start audio
      setAudioPlayed(true); // Set audio as played
    }
    setAudioMuted(!audioMuted); // Toggle mute/unmute
    audio.muted = !audioMuted; // Set audio muted/unmuted
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {/* Background GIF */}
      <img
        src="/racing.gif"
        alt="Background GIF"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* White Mask */}
      <div className="absolute inset-0 bg-gray-200 opacity-60 z-10"></div>

      {/* Logo and Content */}
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        {/* Logo */}
        <img src="logo.png" alt="Parkify Logo" className="w-64 md:w-80 z-50" />

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

      <div className="flex flex-col sm:flex-row sm:space-x-4 w-full max-w-md mx-auto justify-center items-center z-20 mb-20">
        <button
          onClick={() => navigateWithAudioStop("/welcomelessor")}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200 flex-1 mb-4 sm:mb-0"
        >
          <img src="lessor.png" alt="Lessor Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold px-5">Lessor</span>
        </button>

        <button
          onClick={() => navigateWithAudioStop("/welcomerentor")}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200 flex-1 mb-4 sm:mb-0"
        >
          <img src="renter.png" alt="Renter Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold px-5">Renter</span>
        </button>

        <button
          onClick={() => navigateWithAudioStop("/welcomeadmin")}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200 flex-1 mb-4 sm:mb-0"
        >
          <img src="admin.png" alt="Admin Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold px-5">Admin</span>
        </button>

        <button
          onClick={() => navigateWithAudioStop("start_dev")}
          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-lg hover:bg-gray-200 transition duration-200 flex-1 mb-10 sm:mb-0"
        >
          <img src="dev.png" alt="Developer Icon" className="w-12 mb-2" />
          <span className="text-lg font-semibold px-1">Developer</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
