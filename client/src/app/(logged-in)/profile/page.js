"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Calendar } from "lucide-react";
import Header from "@/components/ui/Header";

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

  const profileImage = user?.user_image || "/images/demo_profile_image.jpg";
  const coverImage = user?.cover_image || "/images/demo_cover_image.jpg";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <p className="text-lg text-red-600 font-medium">
            Unable to load profile
          </p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <Header title="Profile" />

      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-80 bg-gradient-to-r from-orange-500 to-orange-400">
            <img
              src={coverImage}
              alt="Cover"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/40 via-orange-400/30 to-orange-300/20" />
          </div>

          {/* Profile Content */}
          <div className="relative px-6 pb-8 -mt-16">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
                <div className="relative">
                  <img
                    src={user.user_picture_url || profileImage}
                    alt="Profile"
                    className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
                  />
                  <div className="absolute -bottom-0 -right-0 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                    Level {user.level}
                  </div>
                </div>

                <div className="mt-4 text-center lg:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.full_name || "User Name"}
                  </h1>
                  <p className="text-orange-600 font-medium mt-1">
                    Ratings <b>{user.user_rating}</b>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-5 w-full">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <Mail className="w-5 h-5 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium text-gray-900">
                        {user.email || "email@example.com"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <Phone className="w-5 h-5 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Mobile Number</p>
                      <p className="font-medium text-gray-900">
                        {user.mobile_no || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-orange-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Class Level</p>
                    <p className="font-semibold text-gray-900">
                      {user.user_class_level || "Not specified"}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-orange-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Group</p>
                    <p className="font-semibold text-gray-900">
                      {user.user_group || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-orange-500" />
                Professional Details
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-400 pl-4">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Experience Level
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {user.user_class_level || "Not specified"}
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-400 pl-4">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Department
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {user.user_department || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-orange-400 pl-4">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Group
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {user.user_group || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
