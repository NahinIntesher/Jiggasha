"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import BrowseQuests from "./BrowseQuest";
import CompletedQuests from "./CompletedQuest";

export default function QuestTabs({ allQuests, completedQuests }) {
  const [activeTab, setActiveTab] = useState("browse");

  const handleClaim = async (questId) => {
    try {
      const res = await fetch("http://localhost:8000/quests/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quest_id: questId }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Claim failed");
      }

      // Use Next.js router to refresh quests
      if (typeof window !== "undefined") {
        const { useRouter } = await import("next/navigation");
        const router = useRouter();
        router.refresh();
      }

      // window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

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

      {activeTab === "browse" && (
        <BrowseQuests quests={allQuests} onClaim={handleClaim} />
      )}
      {activeTab === "completed" && (
        <CompletedQuests quests={completedQuests} />
      )}
    </div>
  );
}
