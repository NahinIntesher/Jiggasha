import Header from "@/components/ui/Header";
import { useUser } from "@/components/Contexts/UserProvider";
import Link from "next/link";
import { FaCrown, FaUsers, FaPlus, FaChevronRight } from "react-icons/fa6";

export default function Play() {
  let battleId = "battle-12345";
  let PairToPairbattleId = "pair-to-pair-battle-12345";

  return (
    <div className="min-h-screen bg-orange-50">
      <Header title="Learn Through Play" />

      {/* Hero Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            Select Game Mode
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Choose your preferred challenge type to begin
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Battle Royale Card */}
          <Link href="/play/matchmaking/royale">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-300 cursor-pointer">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <FaCrown className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Battle Royale
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Multiple player competition format
                </p>

                <div className="flex items-center text-orange-600 font-medium text-sm">
                  <span>Join Battle</span>
                  <FaChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Pair to Pair Battle Card */}
          <Link href="/play/matchmaking/pair">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-300 cursor-pointer">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pair Battle
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  One-on-one competitive format
                </p>

                <div className="flex items-center text-orange-500 font-medium text-sm">
                  <span>Find Opponent</span>
                  <FaChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Create Room Card */}
          <Link href="/create-room">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-300 cursor-pointer">
              <div className="p-6">
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mb-4">
                  <FaPlus className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Create Room
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Private room with custom settings
                </p>

                <div className="flex items-center text-gray-600 font-medium text-sm">
                  <span>Create Room</span>
                  <FaChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        {/* <div className="max-w-3xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600 mb-1">
              1,234
            </div>
            <div className="text-gray-600 text-sm">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600 mb-1">
              567
            </div>
            <div className="text-gray-600 text-sm">Battles Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600 mb-1">
              89
            </div>
            <div className="text-gray-600 text-sm">Live Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600 mb-1">
              4.8
            </div>
            <div className="text-gray-600 text-sm">Avg Rating</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
