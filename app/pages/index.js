// pages/index.js
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PlaceCard from "../components/PlaceCard";
import BottomNav from "../components/BottomNav";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <div className="mt-6">
        <SearchBar />
      </div>

      {/* Recent Places */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Places</h2>
        <div className="grid grid-cols-2 gap-4">
          <PlaceCard imageSrc="/images/yaowarat.jpg" name="Yaowarat" />
          <PlaceCard imageSrc="/images/siam.jpg" name="Siam" />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
