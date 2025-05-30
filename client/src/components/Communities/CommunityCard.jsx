"use client";
import React, { useState } from "react";
import { FaStar, FaUser, FaSpinner } from "react-icons/fa6";
import "@/app/globals.css"; // Ensure global styles are imported

const CommunityCard = ({
  community_id,
  name,
  description,
  subject,
  class_level,
  total_members,
  creator_name = "Unknown",
  creator_image = null,
  isJoined = false,
  onJoinSuccess = () => {},
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [joined, setJoined] = useState(isJoined);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinClick = () => {
    if (joined) return;
    setShowConfirmation(true);
  };

  const handleConfirmJoin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/communities/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ community_id }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setJoined(true);
        onJoinSuccess(community_id);
        setShowConfirmation(false);
      } else {
        alert(data.message || "Failed to join community. Please try again.");
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
      <div className={`card communityCardBox`}>
        {/* Header */}
        <div className="details">
          <div className="cardContentContainer">
            <div className="titleContainer">
              <div className="title">{name}</div>
              <div className="tags">
                <div className="orangeTag">{subject}</div>
                <div className="grayTag">{class_level}</div>
              </div>
              <div className="description">{description}</div>
            </div>

            {/* Join Button */}
            <div className="voting joinSection">
              <button
                onClick={handleJoinClick}
                disabled={joined || isLoading}
                className={`button joinButton ${
                  joined ? "active joined" : "notJoined"
                }`}
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

          <hr />

          {/* Footer Info */}
          <div className="informationContainer">
            <div className="author">
              <div className="profilePicture">
                {creator_image ? (
                  <img src={creator_image} alt={creator_name} />
                ) : (
                  <div className="psudoProfilePicture">{creator_name[0]}</div>
                )}
              </div>
              <div className="nameContainer">
                <div className="createdBy">Created By</div>
                <div className="name">{creator_name}</div>
              </div>
            </div>

            <hr className="gridOnly" />

            <div className="informations">
              <div className="information">
                <FaUser className="icon" />
                <div className="text">{total_members} Members</div>
              </div>
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

export default CommunityCard;
