"use client";
import React from "react";
import { FaFire } from "react-icons/fa";

const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

// Map JS getDay() index (Sun=0,...Sat=6) to your week layout (Sat=0,...Fri=6)
function getDayIndex(jsDay) {
  const map = [1, 2, 3, 4, 5, 6, 0]; // Sun=>1, ..., Sat=>0
  return map[jsDay];
}

function generateActiveDays(startDateStr, endDateStr) {
  const active = Array(7).fill(false);
  if (!startDateStr || !endDateStr) return active;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to midnight

  const todayIdx = getDayIndex(today.getDay());

  // Get Saturday of this week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - todayIdx + 1); // Adjust to Saturday
  weekStart.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(weekStart);
    checkDate.setDate(checkDate.getDate() + i - 1);

    // Compare date strings (ignoring time)
    const checkDateStr = checkDate.toISOString().split("T")[0];
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    if (checkDateStr >= startDateStr && checkDateStr <= endDateStr) {
      active[i] = true;
    }
  }

  return active;
}

export default function LoginStreakCalendar({ login_streak = {} }) {
  const {
    current_streak: current = 0,
    record_streak: record = 0,
    start_date,
    end_date,
  } = login_streak;

  const activeDays = generateActiveDays(start_date, end_date);
  const todayIdx = getDayIndex(new Date().getDay());

  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        <span className="text-orange-400">Login</span> to continue your streak
      </h2>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Current streak: {3/*current*/} day{current !== 1 ? "s" : ""}
        </p>
        <p className="text-sm text-orange-600 font-medium">
          🏆 Record: {15} day{record !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {activeDays.map((active, i) => {
          const isToday = i === todayIdx;

          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center ${
                isToday ? "ring-2 ring-orange-400 rounded-lg" : ""
              }`}
            >
              {i<3 ? (
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center relative">
                  <FaFire className="text-white text-xs" />
                  {current === record && i === todayIdx && record > 0 && (
                    <div className="absolute -top-1 -right-1">
                      <span className="text-yellow-400 text-xs"></span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-8 h-8 border-2 border-gray-200 rounded-lg"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress to record</span>
          <span>
            {3}/{15}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((3 / 15) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
