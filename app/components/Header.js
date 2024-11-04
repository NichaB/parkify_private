// components/Header.js
export default function Header() {
    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Hello, Dr. Pakpong</p>
          <h1 className="text-2xl font-bold">Made you easily</h1>
          <h1 className="text-2xl font-bold text-black">Parking</h1>
        </div>
        <img
          src="/images/Profile.jpeg" // Replace with actual path
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    );
  }
  