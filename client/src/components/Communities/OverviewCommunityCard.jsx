"use client";
import React from "react";
import { FaStar, FaUser } from "react-icons/fa6";

const OverviewCommunityCard = ({
  name,
  description,
  subject,
  class_level,
  rating,
  total_members,
  creator_name,
  creator_image,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col">
      {/* Community Header */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h2 className="text-2xl font-medium text-gray-700">{name}</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
              {subject}
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
              {class_level}
            </span>
          </div>

          {/* Join Button - Absolute positioned */}
          <div className="">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Join
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Footer with Creator and Stats */}
      <div className="flex items-center justify-between mt-auto">
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          {creator_image ? (
            <img
              src={creator_image}
              alt={creator_name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <FaUser size={14} className="text-gray-500" />
            </div>
          )}
          <div>
            <span className="text-orange-500 text-sm">Created By</span>
            <span className="ml-1 text-gray-700">{creator_name}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" size={16} />
            <span className="text-gray-700">{rating?.toFixed(1) || "0.0"}</span>
          </div>

          {/* Members Count */}
          <div className="flex items-center gap-1">
            <FaUser className="text-gray-500" size={14} />
            <span className="text-gray-700">{total_members} Students</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCommunityCard;
