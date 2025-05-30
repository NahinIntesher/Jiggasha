"use client";
import React, { useState } from "react";
import { FaStar, FaUser, FaSpinner } from "react-icons/fa6";

const OverviewCommunityCard = ({
  name,
  description,
  subject,
  class_level,
  rating = 0,
  total_members = 0,
  creator_name = "Unknown",
  creator_image = null,
  community_id,
  isJoined = false,
  onJoinSuccess = () => {},
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [joined, setJoined] = useState(isJoined);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinClick = () => {
    if (joined) return; // Don't show popup if already joined
    setShowConfirmation(true);
  };

  const handleConfirmJoin = async () => {
    setIsLoading(true);
    try {
      // Backend API call
      const response = await fetch("http://localhost:8000/communities/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          communityId: community_id, // Changed to match backend
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setJoined(true);
        onJoinSuccess(community_id, data.data?.totalMembers);
        setShowConfirmation(false);
      } else {
        // Handle error
        alert(
          data.error ||
            data.message ||
            "Failed to join community. Please try again."
        );
      }
    } catch (error) {
      console.error("Error joining community:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelJoin = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                {subject}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {class_level}
              </span>
            </div>
          </div>
          {/* Join Button */}
          <div>
            <button
              onClick={handleJoinClick}
              disabled={joined || isLoading}
              className={`font-medium py-2 px-5 rounded-md transition-colors ${
                joined
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" size={14} />
                  Joining...
                </span>
              ) : joined ? (
                "Joined"
              ) : (
                "Join"
              )}
            </button>
          </div>
        </div>
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {description}
        </p>
        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto">
          {/* Creator Info */}
          <div className="flex items-center gap-3">
            {creator_image ? (
              <img
                src={creator_image}
                alt={creator_name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                <FaUser size={16} className="text-gray-500" />
              </div>
            )}
            <div className="text-sm">
              <span className="text-gray-500">Created by</span>
              <span className="ml-1 text-gray-800 font-medium">
                {creator_name}
              </span>
            </div>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-5 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" size={16} />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-500" size={14} />
              <span>{total_members} Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Join Community
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to join "{name}"? You'll be able to
              participate in discussions and access community resources.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelJoin}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmJoin}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    Joining...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OverviewCommunityCard;
