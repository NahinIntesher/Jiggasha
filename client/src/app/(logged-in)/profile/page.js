"use client";

import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaAward,
  FaUsers,
  FaBookOpen,
  FaStar,
  FaTrophy,
  FaChartLine,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaShieldAlt,
  FaBullseye,
} from "react-icons/fa";
import Header from "@/components/ui/Header";
import Link from "next/link";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const profileImage =
    user?.user_picture_url || "/images/demo_profile_image.jpg";
  const coverImage = user?.cover_image || "/images/demo_cover_image.jpg";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-700">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg max-w-md mx-4 border border-gray-300">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-orange-500 text-3xl">⚠</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Profile Unavailable
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn't load your profile at this time
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Profile" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
          {/* Cover Image with Overlay */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={coverImage}
              alt="Cover"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            <div className="absolute top-6 right-6">
              <Link
                href="/settings/change-profile-picture"
                className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition duration-300 shadow-sm"
              >
                <FaEdit className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8 -mt-16">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Profile Image and Basic Info */}
              <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
                <div className="relative group">
                  <img
                    src={user.user_picture || profileImage}
                    alt="Profile"
                    className="w-60 h-60 rounded-4xl object-cover shadow-lg border-4 border-white"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <FaTrophy className="w-4 h-4" />
                      Level {user.level}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center lg:text-left space-y-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.full_name || "User Name"}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className="flex items-center gap-1">
                      {user.user_rating && (
                        <FaStar className="w-5 h-5 text-orange-400" />
                      )}
                    </div>
                    <span className="text-xl font-bold text-orange-600">
                      {user.user_rating}
                    </span>
                    <span className="text-gray-500">rating</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 lg:mt-0">
                <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Class Level
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.user_class_level || "N/A"}
                      </p>
                    </div>
                    <FaAward className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Department
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.user_department || "N/A"}
                      </p>
                    </div>
                    <FaBookOpen className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Group</p>
                      <p className="text-lg font-bold text-gray-900">
                        {user.user_group || "N/A"}
                      </p>
                    </div>
                    <FaUsers className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information & Details Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                <FaEnvelope className="w-5 h-5 text-white" />
              </div>
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="group hover:bg-orange-50 p-6 rounded-xl transition-all duration-300 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <FaEnvelope className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Email Address
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {user.email || "email@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group hover:bg-orange-50 p-6 rounded-xl transition-all duration-300 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <FaPhone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Mobile Number
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {user.mobile_no || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                <FaBullseye className="w-5 h-5 text-white" />
              </div>
              Professional Summary
            </h3>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Class Level
                    </span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-xl text-sm border border-gray-300">
                      {user.user_class_level || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Department
                    </span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-xl text-sm border border-gray-300">
                      {user.user_department || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Group
                    </span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-xl text-sm border border-gray-300">
                      {user.user_group || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FaStar className="w-5 h-5 text-orange-500 mr-2" />
                  Performance Rating
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {user.user_rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-300 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
              <FaTrophy className="w-5 h-5 text-white" />
            </div>
            Level Progress & Achievements
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Level Progress */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Current Level Progress
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Level {user.level}</span>
                    <span>Next: Level {user.level + 1}</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-orange-500 h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                      style={{ width: `${((user.level % 10) / 10) * 100}%` }}
                    >
                      <span className="text-xs text-black font-bold">
                        {Math.round(((user.level % 10) / 10) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href={"/settings/change-profile-details"}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-sm transition-colors"
                >
                  <FaEdit className="w-5 h-5" />
                  Edit Profile
                </Link>
                <button className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 p-4 rounded-xl shadow-sm transition-colors">
                  <FaShieldAlt className="w-5 h-5" />
                  Privacy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
