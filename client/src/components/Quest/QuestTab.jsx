"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import BrowseQuests from "./BrowseQuest";
import CompletedQuests from "./CompletedQuest";
import { FaList, FaGripVertical } from "react-icons/fa";

export default function QuestTabs({ allQuests, completedQuests }) {
  const [activeTab, setActiveTab] = useState("browse");
  const [view, setView] = useState("grid");

  return (
    <div className="">
      <Header title="My Quests" />
      <div className="tabs">
        <div
          onClick={() => setActiveTab("completed")}
          className={activeTab === "completed" ? "tab tabActive" : "tab"}
        >
          Completed
        </div>
        <div
          onClick={() => setActiveTab("browse")}
          className={activeTab === "browse" ? "tab tabActive" : "tab"}
        >
          In Progress
        </div>
      </div>

      <div className="filterContainer">
        <div className="views">
          <div
            className={view === "list" ? "viewIcon activeIcon" : "viewIcon"}
            onClick={() => setView("list")}
          >
            <FaList />
          </div>
          <div
            className={view === "grid" ? "viewIcon activeIcon" : "viewIcon"}
            onClick={() => setView("grid")}
          >
            <FaGripVertical />
          </div>
        </div>
      </div>

      {activeTab === "browse" && (
        <BrowseQuests quests={allQuests} view={view} setView={setView} />
      )}
      {activeTab === "completed" && (
        <CompletedQuests
          quests={completedQuests}
          view={view}
          setView={setView}
        />
      )}
    </div>
  );
}
