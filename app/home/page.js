// pages/index.js
import Link from "next/link";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PlaceCard from "../components/PlaceCard";
import BottomNav from "../components/BottomNav";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white p-6 pb-20">
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <SearchBar />

  
       {/* Recent Places Section */}
       <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Places</h2>
        
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto space-x-4 pb-2">
        <Link href="/search?place=Yaowarat">
          <PlaceCard imageSrc="/images/yaowarat.jpg" name="Yaowarat" />
        </Link>
        <Link href="/search?place=Siam">
          <PlaceCard imageSrc="/images/siam.jpg" name="Siam" />
        </Link>
        <Link href="/search?place=Don Muang">
          <PlaceCard imageSrc="/images/donmuang.jpg" name="Don Muang" />
        </Link>
        {/* Add more PlaceCard components if needed */}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
