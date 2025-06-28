"use client";

import Header from "@/components/ui/Header";
import { useUser } from "@/components/Contexts/UserProvider";
import Link from "next/link";
import { FaCrown, FaUsers, FaPlus, FaChevronRight } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

export default function Play() {
  let battleId = "battle-12345";
  let PairToPairbattleId = "pair-to-pair-battle-12345";

  const { user } = useUser();

  const [showRoomOptions, setShowRoomOptions] = useState(false);

  return (
    <div className="min-h-screen">
      <Header title="Learn Through Play" />

      {/* User Info Section */}
      <div className="flex items-center justify-between px-6 py-6 mx-auto">
        {/* Profile Info Box */}
        <div className="flex items-center bg-white rounded-xl shadow border border-gray-300 p-3 space-x-4 min-w-[270px]">
          <div className="relative">
            <img
              src={user?.user_picture_url || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-lg object-cover border-1 border-gray-300 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 bg-orange-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
              Lv. {user?.level}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 mr-2">{user?.full_name}</span>
            </div>
            <div className="text-sm text-gray-500">@{user?.username}</div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl px-4 py-2 shadow space-x-2">
            <FaStar className="text-white w-5 h-5 drop-shadow" />
            <span className="text-lg font-bold text-white tracking-wide">{user?.user_rating}</span>
          </div>
          <div className="mb-1 text-sm font-semibold text-gray-500 mt-2">Ratings</div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">
            Select Game Mode
          </h1>
          <p className="text-lg font-medium text-gray-600 max-w-xl mx-auto">
            Choose your preferred challenge type to begin
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Battle Royale Card */}
          <Link href="/play/matchmaking/royale">
            <div className="bg-white rounded-xl shadow-md border border-gray-300 cursor-pointer transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-orange-400">
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
            <div className="bg-white rounded-xl shadow-md border border-gray-300 cursor-pointer transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-orange-400">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pair-to-Pair Battle
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

          {/* Custom Room Card */}
          <div
            className="bg-white rounded-xl shadow-md border border-gray-300 cursor-pointer transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-gray-700"
            onClick={() => setShowRoomOptions(true)}
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mb-4">
                <FaPlus className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Custom Room
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
        </div>
      </div>

      {/* Room Options Modal */}
      {showRoomOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white border border-gray-400 rounded-xl shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Custom Room</h2>
            <button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg mb-3 transition"
              onClick={() => {
                setShowRoomOptions(false);
                // Navigate to create room page
                window.location.href = "/play/custom/create";
              }}
            >
              Create New Room
            </button>
            <button
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg mb-3 transition"
              onClick={() => {
                setShowRoomOptions(false);
                // Navigate to join room page
                window.location.href = "/play/custom/join";
              }}
            >
              Join Room with ID
            </button>
            <button
              className="w-full py-2 rounded-lg mt-2 font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-200 text-sm"
              onClick={() => setShowRoomOptions(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
