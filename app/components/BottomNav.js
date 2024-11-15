// components/BottomNav.js
import { AiFillHome, AiOutlineCalendar, AiOutlineSetting } from "react-icons/ai";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-around bg-white py-2 border-t">
      <button className="text-red-500">
        <AiFillHome size={24} />
      </button>
      <button className="text-gray-500">
        <AiOutlineCalendar size={24} />
      </button>
      <button className="text-gray-500">
        <AiOutlineSetting size={24} />
      </button>
    </div>
  );
}
