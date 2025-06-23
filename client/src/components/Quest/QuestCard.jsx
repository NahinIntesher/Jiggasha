"use client";
import { QUEST_STATUS } from "../../utils/Constant";

export default function QuestCard({ quest, onClaim, view = "grid" }) {
  const status = quest.status;
  const progressPercent = Math.min(
    (quest.progress / quest.target_value) * 100,
    100
  );

  if (view === "list") {
    return (
      <div className="border border-gray-300 rounded-xl shadow-sm bg-white text-black hover:shadow-md transition-shadow">
        {/* Mobile Layout (stacked) */}
        <div className="block sm:hidden p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  status === QUEST_STATUS.CLAIMED
                    ? "bg-green-100"
                    : status === QUEST_STATUS.COMPLETED
                    ? "bg-blue-100"
                    : "bg-orange-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full ${
                    status === QUEST_STATUS.CLAIMED
                      ? "bg-green-600"
                      : status === QUEST_STATUS.COMPLETED
                      ? "bg-blue-300"
                      : "bg-orange-300"
                  }`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold truncate">
                  {quest.title}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            {quest.description}
          </p>

          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                status === QUEST_STATUS.CLAIMED
                  ? "bg-green-600"
                  : status === QUEST_STATUS.COMPLETED
                  ? "bg-blue-300"
                  : "bg-orange-300"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {quest.progress} / {quest.target_value} (
              {progressPercent.toFixed(0)}%)
            </p>
            <button
              className={`px-4 py-2 rounded-lg text-white text-xs font-medium transition-colors ${
                status === QUEST_STATUS.CLAIMED
                  ? "bg-gray-500 cursor-not-allowed"
                  : status === QUEST_STATUS.COMPLETED
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={() => onClaim(quest.quest_id)}
              disabled={status !== QUEST_STATUS.COMPLETED}
            >
              {status === QUEST_STATUS.CLAIMED ? "Claimed" : "Claim"}
            </button>
          </div>
        </div>

        {/* Desktop/Tablet Layout (horizontal) */}
        <div className="hidden sm:flex items-center p-4 lg:p-6 space-x-4 lg:space-x-6">
          {/* Quest Icon/Status Indicator */}
          <div
            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
              status === QUEST_STATUS.CLAIMED
                ? "bg-green-100"
                : status === QUEST_STATUS.COMPLETED
                ? "bg-blue-100"
                : "bg-orange-100"
            }`}
          >
            <div
              className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full ${
                status === QUEST_STATUS.CLAIMED
                  ? "bg-green-600"
                  : status === QUEST_STATUS.COMPLETED
                  ? "bg-blue-300"
                  : "bg-orange-300"
              }`}
            ></div>
          </div>

          {/* Quest Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg lg:text-xl font-semibold mb-1 truncate">
              {quest.title}
            </h3>
            <p className="text-sm lg:text-base text-gray-500 mb-2 line-clamp-2">
              {quest.description}
            </p>

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-2 lg:h-3 mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  status === QUEST_STATUS.CLAIMED
                    ? "bg-green-600"
                    : status === QUEST_STATUS.COMPLETED
                    ? "bg-blue-300"
                    : "bg-orange-300"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs lg:text-sm text-gray-400">
              Progress: {quest.progress} / {quest.target_value} (
              {progressPercent.toFixed(0)}%)
            </p>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <button
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-white text-sm lg:text-base font-medium transition-colors ${
                status === QUEST_STATUS.CLAIMED
                  ? "bg-gray-500 cursor-not-allowed"
                  : status === QUEST_STATUS.COMPLETED
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={() => onClaim(quest.quest_id)}
              disabled={status !== QUEST_STATUS.COMPLETED}
            >
              {status === QUEST_STATUS.CLAIMED ? "Claimed" : "Claim Reward"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="border border-gray-300 p-4 sm:p-6 rounded-xl shadow-sm bg-white text-black hover:shadow-lg">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-normal ${
            status === QUEST_STATUS.CLAIMED
              ? "bg-green-100 text-green-400"
              : status === QUEST_STATUS.COMPLETED
              ? "bg-blue-100 text-blue-400"
              : "bg-orange-100 text-orange-300"
          }`}
        >
          {status === QUEST_STATUS.CLAIMED
            ? "Claimed"
            : status === QUEST_STATUS.COMPLETED
            ? "Completed"
            : "In Progress"}
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            status === QUEST_STATUS.CLAIMED
              ? "bg-green-500"
              : status === QUEST_STATUS.COMPLETED
              ? "bg-blue-300"
              : "bg-orange-300"
          }`}
        ></div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800 leading-tight">
        {quest.title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-3">
        {quest.description}
      </p>

      {/* Progress Section */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Progress
          </span>
          <span className="text-xs sm:text-sm font-bold text-gray-800">
            {progressPercent.toFixed(0)}%
          </span>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === QUEST_STATUS.CLAIMED
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : status === QUEST_STATUS.COMPLETED
                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                : "bg-gradient-orange-300"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs sm:text-sm text-gray-500">
          {quest.progress} / {quest.target_value} completed
        </p>
      </div>

      <button
        className={`w-full mt-3 sm:mt-4 px-4 py-2 sm:py-3 rounded-lg text-white text-sm sm:text-base font-semibold transition-all duration-200 ${
          status === QUEST_STATUS.CLAIMED
            ? "bg-gray-500 cursor-not-allowed"
            : status === QUEST_STATUS.COMPLETED
            ? "bg-green-500 hover:bg-green-600 hover:shadow-lg"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={() => onClaim(quest.quest_id)}
        disabled={status !== QUEST_STATUS.COMPLETED}
      >
        {status === QUEST_STATUS.CLAIMED ? "✓ Claimed" : "Claim Reward"}
      </button>
    </div>
  );
}
