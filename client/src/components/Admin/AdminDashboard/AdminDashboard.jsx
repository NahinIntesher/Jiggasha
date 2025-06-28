"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaBookOpen,
  FaUsers as FaCommunity,
  FaBook,
  FaTrophy,
  FaChartLine,
} from "react-icons/fa6";
import Header from "@/components/ui/Header";

export default function AdminDashboard({ data }) {
  // Add error handling and default values
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="text-orange-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No data available
          </h2>
          <p className="text-gray-500">Please check your API connection</p>
        </div>
      </div>
    );
  }

  // Process top courses data with error handling
  const topCoursesData = (() => {
    try {
      if (!data.top_5_courses || typeof data.top_5_courses !== "string") {
        return [];
      }
      return data.top_5_courses
        .split(", ")
        .map((course) => {
          const match = course.match(/(.*) \((\d+)\)/);
          if (!match) return null;
          return {
            name: match[1],
            students: parseInt(match[2]) || 0,
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error processing top courses data:", error);
      return [];
    }
  })();

  // Process class level data with error handling
  const classLevelData = (() => {
    try {
      if (
        !data.user_class_level_percentage ||
        typeof data.user_class_level_percentage !== "object"
      ) {
        return [];
      }
      return Object.entries(data.user_class_level_percentage)
        .map(([level, percentage]) => ({
          level,
          percentage: parseFloat(percentage) || 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      console.error("Error processing class level data:", error);
      return [];
    }
  })();

  // Enhanced circular progress component
  const CircularProgress = ({ percentage }) => {
    const radius = 200;
    const strokeWidth = 35;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90 filter drop-shadow-lg"
          >
            {/* Background circle */}
            <circle
              stroke="#d1d5db"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke="url(#gradient)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-in-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {percentage}%
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm font-medium text-center">
          Course Completion Rate
        </p>
      </div>
    );
  };

  // Enhanced stats cards data
  const statsCards = [
    {
      title: "Total Users",
      value: data.total_users || "0",
      icon: FaUsers,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Courses",
      value: data.total_courses || "0",
      icon: FaBookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Total Communities",
      value: data.total_communities || "0",
      icon: FaCommunity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Blogs",
      value: data.total_blogs || "0",
      icon: FaBook,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  // Custom colors for pie chart
  const pieColors = [
    "#f97316",
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#84cc16",
  ];

  return (
    <div className="bg-orange-50">
      <Header title="Admin Dashboard" />

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome to Admin Dashboard
              </h1>
              <p className="text-orange-100 text-sm sm:text-base">
                Monitor your platform's performance and user engagement
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Total Overview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent
                      className={`text-xl sm:text-2xl ${stat.color}`}
                    />
                  </div>
                </div>
                <div
                  className={`h-1 bg-gradient-to-r ${stat.gradient} rounded-full mt-4 opacity-60`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Course Completion Progress */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <FaChartLine className="text-orange-500 text-sm" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Course Completion
              </h3>
            </div>
            <div className="flex justify-center">
              <CircularProgress
                percentage={parseFloat(data.course_completion_percentage) || 0}
              />
            </div>
          </div>

          {/* Top 5 Courses */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <FaTrophy className="text-orange-500 text-sm" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Top 5 Courses
              </h3>
            </div>
            {topCoursesData.length > 0 ? (
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCoursesData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                      cursor={{ fill: "rgba(249, 115, 22, 0.1)" }}
                    />
                    <Bar
                      dataKey="students"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FaBookOpen className="text-4xl mb-4 opacity-30" />
                <p className="text-center">No course data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Class Level Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <FaUsers className="text-orange-500 text-sm" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              User Distribution by Class Level
            </h3>
          </div>
          {classLevelData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">
                  Distribution Overview
                </h4>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={classLevelData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="level"
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [`${value}%`, "Percentage"]}
                        cursor={{ fill: "rgba(249, 115, 22, 0.1)" }}
                      />
                      <Bar
                        dataKey="percentage"
                        fill="url(#classBarGradient)"
                        radius={[6, 6, 0, 0]}
                      />
                      <defs>
                        <linearGradient
                          id="classBarGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">
                  Percentage Breakdown
                </h4>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={classLevelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ level, percentage }) =>
                          percentage > 5 ? `${level}: ${percentage}%` : ""
                        }
                        outerRadius={window.innerWidth < 640 ? 70 : 90}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {classLevelData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FaUsers className="text-4xl mb-4 opacity-30" />
              <p className="text-center">No class level data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
