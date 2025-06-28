import { subjectName } from "@/utils/Constant";
import Link from "next/link";
import React from "react";
import {
  FaUser,
  FaTrophy,
  FaClipboardCheck,
  FaBookOpen,
  FaRankingStar,
  FaCalendarDay,
  FaLightbulb,
  FaAward,
  FaFire,
  FaGamepad,
  FaPlay,
  FaStar,
} from "react-icons/fa6";
import LoginStreakCalendar from "./LoginStreakCalendar";

export default function Dashboard({ data }) {
  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Calculate performance metrics
  const overallPerformance = Math.round(data.battle_stats.avg_score || 0);
  const winRate =
    data.battle_stats.total_battles > 0
      ? Math.round(
          (data.battle_stats.pair_wins / data.battle_stats.total_battles) * 100
        )
      : 0;

  // Calculate accuracy from improvement areas
  const totalWrongAnswers = Array.isArray(data.improvement_areas)
    ? data.improvement_areas?.reduce((sum, area) => sum + area.wrong_answers, 0)
    : 0;

  const averageAccuracy =
    data.improvement_areas?.length > 0
      ? Math.round(
          100 - (totalWrongAnswers / data.improvement_areas.length) * 25
        )
      : 100;
  return (
    <div className="min-h-screen bg-[#fffaf3e6] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Row - Profile and Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Profile Card */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
                {/* Greeting */}
                <div className="mb-4">
                  <h1 className="text-xl font-bold text-gray-800 mb-1">
                    {(() => {
                      const hour = new Date().getHours();
                      if (hour < 12) return "Good morning";
                      if (hour < 17) return "Good afternoon";
                      return "Good evening";
                    })()}
                    , {data.profile.full_name}! 👋
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Welcome back to your learning journey
                  </p>
                </div>

                <div className="flex flex-col items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {data.profile.user_picture ? (
                        <img
                          src={data.profile.user_picture}
                          alt="Profile"
                          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h2 className="font-bold text-gray-800 text-lg">
                        {data.profile.full_name}
                      </h2>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-orange-400 text-md" />
                        </div>
                        <span className="text-md font-bold text-orange-600">
                          {420.5}
                        </span>
                        <span className="text-gray-500 text-sm">rating</span>
                      </div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href="/profile"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 w-full py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-3 mt-3"
                  >
                    <FaUser className="text-md" />
                    <span className="text-md">View Profile</span>
                  </Link>
                </div>
              </div>

              {/* Overall Performance Circle */}
              <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center border border-gray-300">
                <h3 className="text-gray-600 text-sm mb-4">
                  Overall performance
                </h3>
                <div className="relative w-40 h-40">
                  <svg
                    className="w-40 h-40 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2.51 * overallPerformance} 251.2`}
                      className="text-orange-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {overallPerformance}%
                    </span>
                    <span className="text-xs text-orange-600 font-medium">
                      PRO LEARNER
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Battles */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FaGamepad className="text-blue-600 text-lg" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {data.battle_stats.total_battles}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Total battles
                  </p>
                  <p className="text-xs text-gray-500">
                    Avg score: {data.battle_stats.avg_score?.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Win Rate */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <FaTrophy className="text-orange-600 text-lg" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {winRate}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Win rate</p>
                  <p className="text-xs text-gray-500">
                    {data.battle_stats.pair_wins}/
                    {data.battle_stats.total_battles} battles won
                  </p>
                </div>
              </div>

              {/* Current Streak */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <FaFire className="text-red-600 text-lg" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {data.login_streak?.current_streak}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Current streak
                  </p>
                  <p className="text-xs text-gray-500">Active battle days</p>
                </div>
              </div>

              {/* Average Rank */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <FaRankingStar className="text-purple-600 text-lg" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {data.battle_stats.avg_rank?.toFixed(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Average rank
                  </p>
                  <p className="text-xs text-gray-500">Battle performance</p>
                </div>
              </div>
            </div>

            {/* Recent Classes */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaBookOpen className="text-orange-500 mr-2 text-lg" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Recent Accessed Courses
                  </h2>
                </div>
                <Link
                  href="/courses"
                  className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {data.recent_classes?.slice(0, 5).map((classItem) => (
                  <div
                    key={classItem.material_id}
                    className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">
                          {classItem.material_name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {classItem.course_name}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <FaCalendarDay className="mr-1" />
                            {new Date(classItem.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">
                            Subject: {subjectName[classItem.subject]}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/courses/${classItem.course_id}/${classItem.material_id}`}
                        className="text-orange-600 hover:text-orange-700 transition-colors ml-4"
                      >
                        <FaPlay className="text-lg" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
              <div className="flex items-center mb-6">
                <FaAward className="text-orange-500 mr-2 text-lg" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Achievements
                </h2>
              </div>
              <div className="space-y-4">
                {data.achievements?.map((achievement) => (
                  <div
                    key={achievement.battle_id}
                    className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {achievement.title}
                        </h3>
                        <p className="text-orange-600 font-medium mt-1">
                          {achievement.achievement_name}
                        </p>
                      </div>
                      <div className="flex items-center bg-orange-500 text-white px-3 py-1 rounded-lg">
                        <FaTrophy className="mr-1 text-sm" />#{achievement.rank}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 ">
            {/* Login Streak Calendar */}

            <LoginStreakCalendar login_streak={data?.login_streak} />

            {/* Improvement Areas */}
            <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
              <div className="flex items-center mb-6">
                <FaLightbulb className="text-orange-500 mr-2 text-lg" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Improvement Areas
                </h2>
              </div>
              <div className="space-y-4">
                {data.improvement_areas?.length === 0 && (
                  <div className="text-gray-500">
                    No improvement areas found.
                  </div>
                )}
                {data.improvement_areas?.map((area, index) => {
                  const accuracy = Math.max(0, 100 - area.wrong_answers * 25);
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-800">
                          {area.subject}
                        </h3>
                        <span className="text-sm text-orange-600 font-medium">
                          {accuracy}%
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Wrong answers:</span>
                          <span className="text-orange-600">
                            {area.wrong_answers}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Low rank battles:</span>
                          <span className="text-orange-600">
                            {area.low_rank_battles}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lost pair battles:</span>
                          <span className="text-orange-600">
                            {area.lost_pair_battles}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/play"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <FaGamepad className="mr-2" />
                  Start New Battle
                </Link>
                <Link
                  href="/courses"
                  className="w-full border border-orange-500 text-orange-600 hover:bg-orange-50 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <FaBookOpen className="mr-2" />
                  Browse Classes
                </Link>

                <Link
                  href="/quests"
                  className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <FaClipboardCheck className="mr-2" />
                  View Completed Quests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
