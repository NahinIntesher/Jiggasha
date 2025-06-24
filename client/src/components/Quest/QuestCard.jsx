"use client";
import { QUEST_STATUS } from "../../utils/Constant";
import { useRouter } from "next/navigation";

export default function QuestCard({ quest, view = "grid" }) {
  const router = useRouter();
  const {
    progress = 0,
    target_type: questGroup = "default",
    target: targetValue = 0,
    is_completed: isCompleted = false,
    claimed = false,
  } = quest;

  const status = claimed
    ? QUEST_STATUS.CLAIMED
    : isCompleted
    ? QUEST_STATUS.COMPLETED
    : QUEST_STATUS.IN_PROGRESS;

  // Only show 100% if quest is actually completed
  const progressPercent = isCompleted
    ? 100
    : Math.min((progress / targetValue) * 100);

  const handleClaim = async (questId) => {
    try {
      const res = await fetch("http://localhost:8000/quests/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quest_id: questId }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to claim reward");
      }

      // Refresh the page to update the quest status
      router.refresh();
    } catch (error) {
      alert(error.message);
    }
  };

  // Helper function for button configuration
  const getButtonConfig = () => {
    switch (status) {
      case QUEST_STATUS.CLAIMED:
        return {
          text: "✓ Claimed",
          className: "bg-gray-200 text-gray-600 cursor-not-allowed",
          disabled: true,
        };
      case QUEST_STATUS.COMPLETED:
        return {
          text: "Claim Reward",
          className: "bg-green-500 text-white hover:bg-green-600",
          disabled: false,
        };
      default:
        return {
          text: "In Progress",
          className: "bg-gray-200 text-gray-500 cursor-not-allowed",
          disabled: true,
        };
    }
  };

  const buttonConfig = getButtonConfig();

  if (view === "list") {
    return (
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  status === QUEST_STATUS.CLAIMED
                    ? "bg-green-500"
                    : status === QUEST_STATUS.COMPLETED
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              />
              <h3 className="text-sm font-medium text-gray-800">
                {quest.title}
              </h3>
            </div>
            <span className="text-xs font-medium text-gray-500">
              {progressPercent.toFixed(0)}%
            </span>
          </div>

          <div className="mb-3">
            <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  status === QUEST_STATUS.CLAIMED
                    ? "bg-green-500"
                    : status === QUEST_STATUS.COMPLETED
                    ? "bg-blue-400"
                    : "bg-amber-400"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {progress} / {targetValue}
            </span>
            <button
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${buttonConfig.className}`}
              onClick={() => handleClaim(quest.quest_id)}
              disabled={buttonConfig.disabled}
            >
              {buttonConfig.text}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <span
          className={`text-xs px-2 py-1 rounded-md ${
            status === QUEST_STATUS.CLAIMED
              ? "bg-green-50 text-green-600"
              : status === QUEST_STATUS.COMPLETED
              ? "bg-blue-50 text-blue-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {status === QUEST_STATUS.CLAIMED
            ? "Claimed"
            : status === QUEST_STATUS.COMPLETED
            ? "Completed"
            : "In Progress"}
        </span>
        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
          {questGroup}
        </span>
      </div>

      <h3 className="text-base font-medium text-gray-800 mb-3">
        {quest.title}
      </h3>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-1">
          <div
            className={`h-full rounded-full ${
              status === QUEST_STATUS.CLAIMED
                ? "bg-green-500"
                : status === QUEST_STATUS.COMPLETED
                ? "bg-blue-400"
                : "bg-amber-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {progress} of {targetValue} completed
        </p>
      </div>

      <button
        className={`w-full py-2 rounded-lg text-sm font-medium ${buttonConfig.className}`}
        onClick={() => handleClaim(quest.quest_id)}
        disabled={buttonConfig.disabled}
      >
        {buttonConfig.text}
      </button>
    </div>
  );
}
