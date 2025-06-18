"use client";

import AllTime from "@/components/Leaderboard/AllTime";
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

      <AllTime />
    </div>
  );
}
