import { AiFillHome, AiOutlineCalendar, AiOutlineSetting } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BottomNav() {
  const router = useRouter();
  const [active, setActive] = useState("home"); // Default active button

  const handleNavigation = (path, button) => {
    setActive(button); // Set the active button
    router.push(path); // Navigate to the specified route
  };

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-around bg-white py-2 border-t">
      <button
        className={active === "home" ? "text-red-500" : "text-gray-500"}
        onClick={() => handleNavigation('/home', 'home')}
      >
        <AiFillHome size={24} />
      </button>
      <button
        className={active === "calendar" ? "text-red-500" : "text-gray-500"}
        onClick={() => handleNavigation('/calendar', 'calendar')}
      >
        <AiOutlineSetting size={24} />
      </button>
    </div>
  );
}
