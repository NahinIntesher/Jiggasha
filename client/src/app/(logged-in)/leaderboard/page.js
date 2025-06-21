"use client";

import AllTimeLeaderboard from "@/components/Leaderboard/AllTimeLeaderboard";
import MonthlyLeaderboard from "@/components/Leaderboard/MonthlyLeaderboard";
import WeeklyLeaderboard from "@/components/Leaderboard/WeeklyLeaderboard";

import Header from "@/components/ui/Header";
import { useState } from "react";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("allTime");

  return (
    <div className="">
      <Header title="Leaderboard" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("allTime")}
          className={activeTab == "allTime" ? "tab tabActive" : "tab"}
        >
          All Time
        </div>
        <div
          onClick={() => setActiveTab("monthly")}
          className={activeTab == "monthly" ? "tab tabActive" : "tab"}
        >
          Monthly
        </div>
        <div
          onClick={() => setActiveTab("weekly")}
          className={activeTab == "weekly" ? "tab tabActive" : "tab"}
        >
          Weekly
        </div>
      </div>

      {activeTab === "allTime" && <AllTimeLeaderboard />}
      {activeTab === "monthly" && <MonthlyLeaderboard />}
      {activeTab === "weekly" && <WeeklyLeaderboard />}
    </div>
  );
}
