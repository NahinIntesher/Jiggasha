"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaSpinner, FaComment } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { dateFormat } from "@/utils/Functions";
import { subjectName } from "@/utils/Constant";

const CommunityCard = ({
  community_id,
  name,
  description,
  subject,
  class_level,
  total_members,
  created_at,
  cover_image_url,
  admin_name = "Unknown",
  admin_id,
  admin_picture,
  isJoined = false,
  onJoinSuccess = () => {},
  view = "grid", // or "list"
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [joined, setJoined] = useState(isJoined);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinClick = () => {
    if (joined) return;
    setShowConfirmation(true);
  };

  useEffect(() => {
    total_members = parseInt(total_members) || 0; // Ensure total_members is a number
  }, [isJoined]);

  const handleConfirmJoin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/communities/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ community_id }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setJoined(true);
        onJoinSuccess(community_id);
        setShowConfirmation(false);
      } else {
        alert(data.message || "Failed to join community.");
      }
    } catch (error) {
      console.error("Error joining community:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelJoin = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Link href={`/communities/${community_id}`} className={`card ${view}Box`}>
        {cover_image_url ? (
          <img className="previewImage" src={cover_image_url} alt="Cover" />
        ) : (
          <div className="psudoPreviewImage">
            <FaComment />
          </div>
        )}

        <div className="details">
          <div className="cardContentContainer">
            <div className="titleContainer">
              <div className="title">{name}</div>
              <div className="tags">
                <div className="orangeTag">
                  {subjectName[subject] || subject}
                </div>
                <div className="grayTag">{class_level}</div>
              </div>
              <div className="description">{description}</div>
            </div>

            <div className="joinSection">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleJoinClick();
                }}
                disabled={joined || isLoading}
                className={`bg-orange-400 hover:bg-orange-500 font-semibold text-white px-6 py-2 rounded-xl  ${
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

          <div className="informationContainer">
            <div className="author">
              <div className="profilePicture">
                {admin_picture ? (
                  <img src={admin_picture} alt={admin_name} />
                ) : (
                  <div className="psudoProfilePicture">{admin_name[0]}</div>
                )}
              </div>
              <div className="nameContainer">
                <div className="createdBy">Created By</div>
                <div className="name">{admin_name}</div>
              </div>
            </div>

            <hr className="gridOnly" />
            <div className="informations">
              <div className="information">
                <FaCalendarAlt className="icon" />
                <div className="text">{dateFormat(created_at)}</div>
              </div>
              <div className="information">
                <FaUser className="icon" />
                <div className="text">{total_members} Members</div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Join Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl  border border-orange-600 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Join Community
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to join "{name}"?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelJoin}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmJoin}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
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
